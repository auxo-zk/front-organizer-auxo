import { Typography, Paper, Box, Button } from '@mui/material';
import ReactQuill from 'react-quill';
import { useCampaignData, useCampaignFunctions } from 'src/states/campaign';

export default function ApplicationForm() {
    const data = useCampaignData();
    const { setCampaignData, setApplicationForm } = useCampaignFunctions();

    const handleDetailQuestionChange = (key: string, value: string) => {
        setApplicationForm({
            [key]: {
                ...(data.applicationForm[key] || {}),
                detail: value,
            },
        });
    };
    const handleQuestionHintChange = (key: string, value: string) => {
        setApplicationForm({
            [key]: {
                ...(data.applicationForm[key] || {}),
                hint: value,
            },
        });
    };
    const handleQuestionRequiredChange = (key: string, value: boolean) => {
        setApplicationForm({
            [key]: {
                ...(data.applicationForm[key] || {}),
                required: value,
            },
        });
    };
    const handleAddQuestion = () => {
        const newKey = Date.now();
        setApplicationForm({
            [newKey]: {
                detail: '',
                hint: '',
                required: false,
            },
        });
    };
    return (
        <>
            <Typography variant="h6" mt={2} mb={4}>
                Application Form
            </Typography>
            {Object.entries(data.applicationForm).map(([key, item], index) => {
                return (
                    <Paper key={key} sx={{ p: 3 }}>
                        <Typography variant="h6">Question {index}</Typography>
                        <ReactQuill theme="snow" value={item.detail} onChange={(v) => handleDetailQuestionChange(key, v)} />
                    </Paper>
                );
            })}
            <Box>
                <Button onClick={handleAddQuestion}>Add Question</Button>
            </Box>
        </>
    );
}
