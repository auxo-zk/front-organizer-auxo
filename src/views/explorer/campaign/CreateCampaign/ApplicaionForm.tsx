import { Typography, Paper, Box, Button, Switch, IconButton, TextField } from '@mui/material';
import ReactQuill from 'react-quill';
import CustomEditor from 'src/components/CustomEditor/CustomEditor';
import { CampaignDataType, useCampaignData, useCampaignFunctions } from 'src/states/campaign';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { v4 as uuid } from 'uuid';
import { IconRemove, IconTrash } from 'src/assets/svg/icon';

export default function ApplicationForm() {
    const { applicationForm } = useCampaignData();
    const { setCampaignData, addApplicationFormItem, deleteApplicationFormItem, editApplicationFormItem } = useCampaignFunctions();

    const handleItemChange = (index: number, value: Partial<CampaignDataType['applicationForm'][number]>) => {
        editApplicationFormItem(index, value);
    };
    const handleAddItem = () => {
        addApplicationFormItem({
            id: uuid(),
            hint: '',
            detail: '',
            required: false,
        });
    };

    return (
        <>
            {/* <button onClick={() => console.log(applicationForm)}>click</button> */}
            <Typography variant="h6" mt={6} mb={3}>
                Application Form
            </Typography>
            <Paper sx={{ p: 3, backgroundColor: '#FFF8F6', my: 2 }}>
                {applicationForm.map((item, index) => {
                    return (
                        <Box key={item.id + index} sx={{ mb: 6 }}>
                            <Box mb={2} sx={{ display: 'flex', justifyContent: 'space-between', placeItems: 'center' }}>
                                <Typography variant="h6">Question {index + 1}</Typography>
                                <IconButton onClick={() => deleteApplicationFormItem(index)}>
                                    <IconTrash sx={{ color: 'primary.light' }} />
                                </IconButton>
                            </Box>
                            <CustomEditor value={item.detail} onChange={(v) => handleItemChange(index, { detail: v })} />
                            <TextField label="Hint (optional)" value={item.hint} onChange={(e) => handleItemChange(index, { hint: e.target.value })} fullWidth sx={{ mt: 2, background: 'white' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mt: 1 }}>
                                <Typography>Required</Typography>
                                <Switch checked={item.required} onChange={(e) => handleItemChange(index, { required: e.target.checked })} />
                            </Box>
                        </Box>
                    );
                })}
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <Button variant="outlined" onClick={handleAddItem}>
                    Add Question
                </Button>
            </Box>
        </>
    );
}
