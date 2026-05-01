import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SearchInput } from '../../../components/common/SearchInput.jsx';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('SearchInput', () => {
    test('renders an input element', () => {
        render(<SearchInput value="" onChange={vi.fn()} />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('displays the provided value', () => {
        render(<SearchInput value="hello" onChange={vi.fn()} />);
        expect(screen.getByRole('textbox')).toHaveValue('hello');
    });

    test('shows default placeholder when none is provided', () => {
        render(<SearchInput value="" onChange={vi.fn()} />);
        expect(screen.getByPlaceholderText('ค้นหา...')).toBeInTheDocument();
    });

    test('shows custom placeholder when provided', () => {
        render(<SearchInput value="" onChange={vi.fn()} placeholder="Search here" />);
        expect(screen.getByPlaceholderText('Search here')).toBeInTheDocument();
    });

    test('calls onChange with new value when user types', () => {
        const onChange = vi.fn();
        render(<SearchInput value="" onChange={onChange} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
        expect(onChange).toHaveBeenCalledWith('test');
    });

    test('calls onChange once per change event', () => {
        const onChange = vi.fn();
        render(<SearchInput value="" onChange={onChange} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('renders search icon span', () => {
        render(<SearchInput value="" onChange={vi.fn()} />);
        const icon = document.querySelector('.material-symbols-outlined');
        expect(icon).toBeInTheDocument();
        expect(icon.textContent).toBe('search');
    });

    test('input type is text', () => {
        render(<SearchInput value="" onChange={vi.fn()} />);
        expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    test('applies custom className to container div', () => {
        render(<SearchInput value="" onChange={vi.fn()} className="my-search-class" />);
        const container = document.querySelector('.my-search-class');
        expect(container).toBeInTheDocument();
    });

    test('passes extra props to input element', () => {
        render(<SearchInput value="" onChange={vi.fn()} data-testid="search-field" />);
        expect(screen.getByTestId('search-field')).toBeInTheDocument();
    });

    test('calls onChange with empty string when input is cleared', () => {
        const onChange = vi.fn();
        render(<SearchInput value="existing" onChange={onChange} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
        expect(onChange).toHaveBeenCalledWith('');
    });
});
