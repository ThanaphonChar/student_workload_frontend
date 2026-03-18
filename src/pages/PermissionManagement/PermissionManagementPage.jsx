import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import GlobalUserSearch from '../../components/PermissionManagement/GlobalUserSearch';
import RoleSection from '../../components/PermissionManagement/RoleSection';
import * as permissionService from '../../services/permission.service';

const ROLE_SECTIONS = [
    { key: 'academic_officer', title: 'เจ้าหน้าที่วิชาการ' },
    { key: 'professor', title: 'อาจารย์' },
    { key: 'program_chair', title: 'ประธานหลักสูตร' },
];

function getMemberName(member) {
    const th = `${member.first_name_th || ''} ${member.last_name_th || ''}`.trim();
    if (th) return th;
    return `${member.first_name_en || ''} ${member.last_name_en || ''}`.trim();
}

export default function PermissionManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [groupedUsers, setGroupedUsers] = useState({
        academic_officer: [],
        professor: [],
        program_chair: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addingByRole, setAddingByRole] = useState({});
    const [removingKey, setRemovingKey] = useState('');

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await permissionService.getUsersGroupedByRole();
            setGroupedUsers(data);
        } catch (err) {
            setError(err.message || 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredByRole = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return groupedUsers;

        return ROLE_SECTIONS.reduce((acc, section) => {
            const members = groupedUsers[section.key] || [];
            acc[section.key] = members.filter((member) => {
                const name = getMemberName(member).toLowerCase();
                const email = (member.email || '').toLowerCase();
                return name.includes(q) || email.includes(q);
            });
            return acc;
        }, {});
    }, [groupedUsers, searchQuery]);

    const hasAnyResult = useMemo(() => {
        return ROLE_SECTIONS.some((section) => (filteredByRole[section.key] || []).length > 0);
    }, [filteredByRole]);

    const handleAdd = async (roleKey, selectedInstructors) => {
        try {
            setAddingByRole((prev) => ({ ...prev, [roleKey]: true }));
            const data = await permissionService.bulkAddUsers(selectedInstructors, roleKey);
            setGroupedUsers(data);
        } catch (err) {
            setError(err.message || 'เพิ่มผู้ใช้ไม่สำเร็จ');
        } finally {
            setAddingByRole((prev) => ({ ...prev, [roleKey]: false }));
        }
    };

    const handleRemove = async (member) => {
        const key = `${member.id}-${member.role_id}`;
        try {
            setRemovingKey(key);
            await permissionService.removeUserRole(member.id, member.role_id);
            await loadUsers();
        } catch (err) {
            setError(err.message || 'ลบสิทธิ์ไม่สำเร็จ');
        } finally {
            setRemovingKey('');
        }
    };

    return (
        <AppShell title="การจัดการสิทธิ์">
            <div className="space-y-6">
                {/* <h1 className="text-5xl font-bold text-gray-900">การจัดการสิทธิ์</h1> */}
                <h1 className="pt-4 text-4xl font-bold text-gray-900">
                    การจัดการสิทธิ์
                </h1>

                <GlobalUserSearch value={searchQuery} onChange={setSearchQuery} />

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xl text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-xl text-gray-500">กำลังโหลดข้อมูล...</div>
                ) : (
                    <div className="space-y-6">
                        {!hasAnyResult && searchQuery.trim() ? (
                            <div className="rounded-lg bg-gray-50 p-4 text-xl text-gray-500">ไม่พบผู้ใช้ที่ค้นหา</div>
                        ) : (
                            ROLE_SECTIONS.map((section) => {
                                const members = filteredByRole[section.key] || [];
                                if (searchQuery.trim() && members.length === 0) return null;

                                return (
                                    <RoleSection
                                        key={section.key}
                                        roleKey={section.key}
                                        title={section.title}
                                        members={members}
                                        onAdd={handleAdd}
                                        onRemove={handleRemove}
                                        adding={!!addingByRole[section.key]}
                                        removingKey={removingKey}
                                    />
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </AppShell>
    );
}
