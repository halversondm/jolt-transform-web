import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import TransformPage from '../components/TransformPage';

const renderPage = () =>
    render(
        <MemoryRouter>
            <TransformPage />
        </MemoryRouter>
    );

describe('TransformPage', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders Input, Spec, and Output labels', () => {
        renderPage();
        expect(screen.getByText('Input')).toBeInTheDocument();
        expect(screen.getByText('Spec')).toBeInTheDocument();
        expect(screen.getByText('Output')).toBeInTheDocument();
    });

    it('renders the Transform button', () => {
        renderPage();
        expect(screen.getByRole('button', { name: /transform/i })).toBeInTheDocument();
    });

    it('shows an error when input is invalid JSON', async () => {
        renderPage();
        const [inputArea] = screen.getAllByRole('textbox');
        await userEvent.type(inputArea, 'not-json');
        await userEvent.click(screen.getByRole('button', { name: /^transform$/i }));
        expect(await screen.findByText('Input is not valid JSON')).toBeInTheDocument();
    });

    it('shows an error when spec is invalid JSON', async () => {
        renderPage();
        const textareas = screen.getAllByRole('textbox');
        fireEvent.change(textareas[0], { target: { value: '{"key":"value"}' } });
        fireEvent.change(textareas[1], { target: { value: 'bad-spec' } });
        await userEvent.click(screen.getByRole('button', { name: /^transform$/i }));
        expect(await screen.findByText('Spec is not valid JSON')).toBeInTheDocument();
    });

    it('shows transformed output on successful API response', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({ output: { result: 'ok' } }),
        }));

        renderPage();
        const textareas = screen.getAllByRole('textbox');
        fireEvent.change(textareas[0], { target: { value: '{"a":1}' } });
        fireEvent.change(textareas[1], { target: { value: '[{"operation":"shift"}]' } });
        await userEvent.click(screen.getByRole('button', { name: /^transform$/i }));

        await waitFor(() => {
            expect(textareas[2]).toHaveValue(JSON.stringify({ result: 'ok' }, null, 2));
        });
    });

    it('shows an error when the API returns a non-ok response', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: false }));

        renderPage();
        await userEvent.click(screen.getByRole('button', { name: /^transform$/i }));

        expect(await screen.findByText('Transformation failed')).toBeInTheDocument();
    });

    it('shows an error on network failure', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('Network error')));

        renderPage();
        await userEvent.click(screen.getByRole('button', { name: /^transform$/i }));

        expect(await screen.findByText('Network or server error')).toBeInTheDocument();
    });

    it('disables the button while loading', async () => {
        vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));

        renderPage();
        const button = screen.getByRole('button', { name: /^transform$/i });
        await userEvent.click(button);

        expect(screen.getByRole('button', { name: /transforming/i })).toBeDisabled();
    });
});
