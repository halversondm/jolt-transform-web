import { render, screen } from '@testing-library/react';
import JsonEditorWithLineNumbers from '../components/JsonEditorWithLineNumbers';

describe('JsonEditorWithLineNumbers', () => {
    it('renders a textarea', () => {
        render(<JsonEditorWithLineNumbers value="" onChange={() => {}} />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('displays the provided value', () => {
        render(<JsonEditorWithLineNumbers value='{"key":"val"}' onChange={() => {}} />);
        expect(screen.getByRole('textbox')).toHaveValue('{"key":"val"}');
    });

    it('shows the placeholder text', () => {
        render(<JsonEditorWithLineNumbers value="" onChange={() => {}} placeholder="Type here..." />);
        expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
    });

    it('renders a line number for each line', () => {
        const multiline = 'line1\nline2\nline3';
        render(<JsonEditorWithLineNumbers value={multiline} onChange={() => {}} />);
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('sets readOnly on the textarea when readOnly prop is true', () => {
        render(<JsonEditorWithLineNumbers value="" readOnly />);
        expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });

    it('assigns the id prop to the textarea', () => {
        render(<JsonEditorWithLineNumbers value="" onChange={() => {}} id="my-editor" />);
        expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-editor');
    });
});
