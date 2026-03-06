import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Header from '../components/Header';

const renderWithRouter = (initialEntry = '/') =>
    render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <Header />
        </MemoryRouter>
    );

describe('Header', () => {
    it('renders the app title', () => {
        renderWithRouter();
        expect(screen.getByText('JOLT Transformer')).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
        renderWithRouter();
        expect(screen.getByRole('link', { name: /transform/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /documentation/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /build spec/i })).toBeInTheDocument();
    });

    it('applies active style to the current route link', () => {
        renderWithRouter('/');
        const transformLink = screen.getByRole('link', { name: /transform/i });
        expect(transformLink.className).toContain('border-b-2');
    });

    it('does not apply active style to inactive links', () => {
        renderWithRouter('/');
        const docsLink = screen.getByRole('link', { name: /documentation/i });
        expect(docsLink.className).not.toContain('border-b-2');
    });

    it('applies active style to /build route', () => {
        renderWithRouter('/build');
        const buildLink = screen.getByRole('link', { name: /build spec/i });
        expect(buildLink.className).toContain('border-b-2');
    });
});
