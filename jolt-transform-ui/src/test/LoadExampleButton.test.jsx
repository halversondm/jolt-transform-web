import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoadExampleButton from '../components/LoadExampleButton';

describe('LoadExampleButton', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders with the given label', () => {
        render(<LoadExampleButton label="Load Example" files={[]} onLoad={() => {}} setError={() => {}} />);
        expect(screen.getByRole('button', { name: /load example/i })).toBeInTheDocument();
    });

    it('calls onLoad with fetched file texts on success', async () => {
        const onLoad = vi.fn();
        const setError = vi.fn();
        vi.stubGlobal('fetch', vi.fn()
            .mockResolvedValueOnce({ ok: true, text: async () => '{"a":1}' })
            .mockResolvedValueOnce({ ok: true, text: async () => '{"b":2}' })
        );

        render(
            <LoadExampleButton
                label="Load"
                files={['/input.json', '/spec.json']}
                onLoad={onLoad}
                setError={setError}
            />
        );

        await userEvent.click(screen.getByRole('button'));

        expect(setError).toHaveBeenCalledWith('');
        expect(onLoad).toHaveBeenCalledWith('{"a":1}', '{"b":2}');
    });

    it('calls setError when a fetch response is not ok', async () => {
        const onLoad = vi.fn();
        const setError = vi.fn();
        vi.stubGlobal('fetch', vi.fn()
            .mockResolvedValueOnce({ ok: false, text: async () => '' })
        );

        render(
            <LoadExampleButton
                label="Load"
                files={['/input.json']}
                onLoad={onLoad}
                setError={setError}
            />
        );

        await userEvent.click(screen.getByRole('button'));

        expect(setError).toHaveBeenCalledWith('Failed to load input or spec file');
        expect(onLoad).not.toHaveBeenCalled();
    });

    it('calls setError when fetch throws a network error', async () => {
        const onLoad = vi.fn();
        const setError = vi.fn();
        vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('Network error')));

        render(
            <LoadExampleButton
                label="Load"
                files={['/input.json']}
                onLoad={onLoad}
                setError={setError}
            />
        );

        await userEvent.click(screen.getByRole('button'));

        expect(setError).toHaveBeenCalledWith('Failed to load input or spec file');
    });
});
