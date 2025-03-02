import { render, screen } from '@testing-library/react';
import { Form } from '.';

describe('Form', () => {
    test('renders all form fields', () => {
        render(<Form />);

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    test('renders with empty fields initially', () => {
        render(<Form />);

        expect(screen.getByLabelText(/name/i)).toHaveValue('');
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
        expect(screen.getByLabelText(/subject/i)).toHaveValue('');
        expect(screen.getByLabelText(/message/i)).toHaveValue('');
    });
});