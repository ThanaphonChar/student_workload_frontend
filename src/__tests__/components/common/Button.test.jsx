import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Button } from '../../../components/common/Button.jsx';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('Button', () => {
    test('renders children text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    test('renders as a button element', () => {
        render(<Button>Submit</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('calls onClick when clicked', () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when disabled', () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick} disabled>Click</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });

    test('is disabled when disabled prop is true', () => {
        render(<Button disabled>Click</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    test('is disabled when isLoading is true', () => {
        render(<Button isLoading>Loading</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    test('shows spinner svg when isLoading is true', () => {
        render(<Button isLoading>Save</Button>);
        const button = screen.getByRole('button');
        expect(button.querySelector('svg')).toBeInTheDocument();
    });

    test('still shows children text when isLoading is true', () => {
        render(<Button isLoading>Save</Button>);
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    test('does not show spinner when isLoading is false', () => {
        render(<Button isLoading={false}>Save</Button>);
        const button = screen.getByRole('button');
        expect(button.querySelector('svg')).not.toBeInTheDocument();
    });

    test('defaults to type="button"', () => {
        render(<Button>Click</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    test('accepts type="submit"', () => {
        render(<Button type="submit">Submit</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    test('accepts type="reset"', () => {
        render(<Button type="reset">Reset</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });

    test('passes additional props to button element', () => {
        render(<Button data-testid="my-button">Click</Button>);
        expect(screen.getByTestId('my-button')).toBeInTheDocument();
    });

    test('renders with primary variant by default', () => {
        render(<Button>Primary</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toMatch(/bg-\[#050C9C\]/);
    });

    test('renders with secondary variant', () => {
        render(<Button variant="secondary">Secondary</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toMatch(/bg-\[#F1F1F1\]/);
    });

    test('renders with danger variant', () => {
        render(<Button variant="danger">Delete</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toMatch(/bg-red-600/);
    });

    test('renders with success variant', () => {
        render(<Button variant="success">Done</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toMatch(/bg-\[#10B981\]/);
    });

    test('renders with outline variant', () => {
        render(<Button variant="outline">Outline</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toMatch(/bg-transparent/);
    });

    test('applies custom className', () => {
        render(<Button className="my-custom-class">Click</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('my-custom-class');
    });

    test('applies sm size class', () => {
        render(<Button size="sm">Small</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toMatch(/px-2/);
    });

    test('applies lg size class', () => {
        render(<Button size="lg">Large</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toMatch(/px-6/);
    });

    test('applies w-full class when fullWidth is true', () => {
        render(<Button fullWidth>Full</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toMatch(/w-full/);
    });

    test('does not apply w-full when fullWidth is false', () => {
        render(<Button fullWidth={false}>Normal</Button>);
        const button = screen.getByRole('button');
        expect(button.className).not.toMatch(/\bw-full\b/);
    });
});
