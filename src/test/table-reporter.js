/**
 * Custom Vitest table reporter
 * Displays test results in a formatted table grouped by category.
 */

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const WHITE = '\x1b[37m';
const GRAY = '\x1b[90m';

function getType(filepath) {
    if (filepath.includes('/__tests__/services/') || filepath.includes('/services/')) return 'Service';
    if (filepath.includes('/__tests__/components/') || filepath.includes('/components/')) return 'Component';
    if (filepath.includes('/__tests__/pages/') || filepath.includes('/pages/')) return 'Page';
    if (filepath.includes('/__tests__/hooks/') || filepath.includes('/hooks/')) return 'Hook';
    if (filepath.includes('/__tests__/repositories/') || filepath.includes('/repositories/')) return 'Repository';
    if (filepath.includes('/__tests__/controllers/') || filepath.includes('/controllers/')) return 'Controller';
    return 'Other';
}

function getCategory(type) {
    const map = {
        Hook: 'Hooks',
        Service: 'Services',
        Component: 'Components',
        Page: 'Pages',
        Repository: 'Repositories',
        Controller: 'Controllers',
        Other: 'Other',
    };
    return map[type] ?? 'Other';
}

function countTests(tasks = []) {
    let count = 0;
    for (const task of tasks) {
        if (task.type === 'test' || task.type === 'custom') {
            count++;
        } else if (task.tasks?.length) {
            count += countTests(task.tasks);
        }
    }
    return count;
}

function shortPath(filepath, cwd) {
    const rel = filepath.replace(cwd + '/', '');
    // Shorten paths like src/__tests__/components/Foo.test.jsx → components/.../Foo.test.jsx
    return rel
        .replace(/^src\/__tests__\//, '')
        .replace(/^src\//, '');
}

function pad(str, len) {
    const plain = str.replace(/\x1b\[[0-9;]*m/g, '');
    const diff = len - plain.length;
    return str + ' '.repeat(Math.max(0, diff));
}

function hr(char = '─', len = 72) {
    return GRAY + char.repeat(len) + RESET;
}

export default class TableReporter {
    onFinished(files = [], errors = []) {
        const cwd = process.cwd();

        const rows = files.map((f, i) => {
            const type = getType(f.filepath ?? f.name ?? '');
            const tests = countTests(f.tasks ?? []);
            const duration = Math.round(f.result?.duration ?? 0);
            const passed = f.result?.state === 'pass';
            return { i: i + 1, file: f.filepath ?? f.name ?? '', type, tests, duration, passed };
        });

        // Group by category
        const categoryOrder = ['Hooks', 'Services', 'Components', 'Pages', 'Repositories', 'Controllers', 'Other'];
        const grouped = {};
        for (const row of rows) {
            const cat = getCategory(row.type);
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(row);
        }

        // Header
        console.log('');
        console.log(pad(BOLD + GRAY + 'No.' + RESET, 6),
            pad(BOLD + GRAY + 'File' + RESET, 48),
            pad(BOLD + GRAY + 'Type' + RESET, 12),
            pad(BOLD + GRAY + 'Tests' + RESET, 8),
            pad(BOLD + GRAY + 'Time' + RESET, 10),
            BOLD + GRAY + 'Result' + RESET);
        console.log(hr());

        let counter = 1;
        let totalTests = 0;
        let totalDuration = 0;
        let allPassed = true;

        for (const cat of categoryOrder) {
            const catRows = grouped[cat];
            if (!catRows?.length) continue;

            console.log(BOLD + WHITE + `[ ${cat} ]` + RESET);

            for (const row of catRows) {
                const num = String(counter).padStart(2, ' ');
                const filePath = shortPath(row.file, cwd);
                const result = row.passed
                    ? GREEN + '✓ passed' + RESET
                    : RED + '✗ failed' + RESET;

                console.log(
                    pad(GRAY + num + RESET, 6),
                    pad(CYAN + filePath + RESET, 48),
                    pad(YELLOW + row.type + RESET, 12),
                    pad(WHITE + String(row.tests) + RESET, 8),
                    pad(GRAY + row.duration + ' ms' + RESET, 10),
                    result
                );

                totalTests += row.tests;
                totalDuration += row.duration;
                if (!row.passed) allPassed = false;
                counter++;
            }
        }

        console.log(hr());

        // Total row
        const totalLabel = `Total (${files.length} files)`;
        const totalResult = allPassed
            ? GREEN + '✓ all passed' + RESET
            : RED + '✗ some failed' + RESET;
        console.log(
            ' '.repeat(6),
            pad(BOLD + WHITE + totalLabel + RESET, 48),
            ' '.repeat(12),
            pad(BOLD + WHITE + String(totalTests) + RESET, 8),
            pad(GRAY + Math.round(totalDuration) + ' ms' + RESET, 10),
            totalResult
        );
        console.log('');

        if (errors.length) {
            for (const err of errors) {
                console.error(RED + String(err) + RESET);
            }
        }
    }
}
