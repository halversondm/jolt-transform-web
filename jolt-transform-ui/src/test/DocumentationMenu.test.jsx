import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import DocumentationMenu from '../components/DocumentationMenu';

const renderWithRouter = (initialEntry = '/docs') =>
    render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <DocumentationMenu />
        </MemoryRouter>
    );

describe('DocumentationMenu', () => {
    it('renders all documentation links', () => {
        renderWithRouter();
        expect(screen.getByRole('link', { name: /shift/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /default/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /remove/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /cardinality/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /sort/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /custom/i })).toBeInTheDocument();
    });

    it('applies active style to the current doc link', () => {
        renderWithRouter('/docs/shift');
        const shiftLink = screen.getByRole('link', { name: /shift/i });
        expect(shiftLink.className).toContain('font-bold');
    });

    it('does not apply active style to inactive doc links', () => {
        renderWithRouter('/docs/shift');
        const defaultLink = screen.getByRole('link', { name: /default/i });
        expect(defaultLink.className).not.toContain('font-bold');
    });
});
