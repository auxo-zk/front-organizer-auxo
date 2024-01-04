import { Typography, Paper, Box, Button, Switch, IconButton } from '@mui/material';
import ReactQuill from 'react-quill';
import CustomEditor from 'src/components/CustomEditor/CustomEditor';
import { useCampaignData, useCampaignFunctions } from 'src/states/campaign';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

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
            <Paper sx={{ p: 3, backgroundColor: '#FFF8F6', my: 2 }}>
                {Object.entries(data.applicationForm).map(([key, item], index) => {
                    return (
                        <Box key={key} sx={{ mb: 6 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" mb={2}>
                                    Question {index + 1}
                                </Typography>
                                <IconButton>
                                    <DeleteOutlinedIcon />
                                </IconButton>
                            </Box>
                            <CustomEditor value={item.detail} onChange={(v) => handleDetailQuestionChange(key, v)} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mt: 1 }}>
                                <Typography>Required</Typography>
                                <Switch />
                            </Box>
                        </Box>
                    );
                })}
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <Button variant="outlined" onClick={handleAddQuestion}>
                    Add Question
                </Button>
            </Box>
        </>
    );
}
