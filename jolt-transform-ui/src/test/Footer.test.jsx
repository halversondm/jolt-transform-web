import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer', () => {
    it('renders the footer element', () => {
        render(<Footer />);
        const footer = screen.getByRole('contentinfo');
        expect(footer).toBeInTheDocument();
    });

    it('displays the current year', () => {
        render(<Footer />);
        const year = new Date().getFullYear().toString();
        expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    });

    it('renders the halversondm.com link', () => {
        render(<Footer />);
        const link = screen.getByRole('link', { name: /halversondm\.com/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('target', '_blank');
    });
});
