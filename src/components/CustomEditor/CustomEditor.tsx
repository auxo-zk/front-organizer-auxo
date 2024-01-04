import { Box } from '@mui/material';
import ReactQuill, { ReactQuillProps } from 'react-quill';

export default function CustomEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
        <Box
            sx={(theme) => ({
                '& .ql-container.ql-snow': { border: 'none' },
                '& .ql-toolbar': {
                    mb: 2,
                    borderRadius: 2,
                    border: 'none !important',
                    boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.12)',
                    backgroundColor: '#FFFFFF',
                },
                '& .ql-editor': {
                    border: '1px solid ' + theme.palette.background.primary + ' !important',
                    borderRadius: 2.5,
                    minHeight: '160px',
                    backgroundColor: '#FFFFFF',
                },
            })}
        >
            <ReactQuill theme="snow" value={value} onChange={onChange} />
        </Box>
    );
}
