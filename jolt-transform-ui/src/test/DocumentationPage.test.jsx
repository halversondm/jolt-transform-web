import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import DocumentationPage from '../components/DocumentationPage';

const renderWithRouter = (initialEntry = '/docs') =>
    render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
                <Route path="/docs/*" element={<DocumentationPage />} />
            </Routes>
        </MemoryRouter>
    );

describe('DocumentationPage', () => {
    it('renders the Documentation heading', () => {
        renderWithRouter();
        expect(screen.getByRole('heading', { name: /documentation/i })).toBeInTheDocument();
    });

    it('renders a link to the official JOLT GitHub page', () => {
        renderWithRouter();
        expect(screen.getByRole('link', { name: /jolt github/i })).toBeInTheDocument();
    });

    it('renders the documentation navigation menu', () => {
        renderWithRouter();
        expect(screen.getByRole('link', { name: /shift/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /default/i })).toBeInTheDocument();
    });

    it('shows the default prompt when no sub-route is selected', () => {
        renderWithRouter('/docs');
        expect(screen.getByText(/select a topic/i)).toBeInTheDocument();
    });
});
