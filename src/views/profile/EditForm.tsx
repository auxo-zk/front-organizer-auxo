import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useProfileData, useProfileFunction } from './state';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useModalData, useModalFunction } from 'src/states/modal';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';

export default function EditForm() {
    const { submitProfileInfo, getProfileData } = useProfileFunction();
    const { closeModal } = useModalFunction();
    const { name, description, website } = useProfileData();
    const [editFullName, setEditFullName] = useState<string>(name);
    const [editDescription, setEditDescription] = useState<string>(description);
    const [editWebsite, setEditWebsite] = useState<string>(website);
    const [loading, setLoading] = useState<boolean>(false);

    const handlePostInfo = async () => {
        if (!editFullName) {
            toast('Full Name cannot be empty', { type: 'warning' });
            return;
        }
        setLoading(true);
        await submitProfileInfo({
            description: editDescription || '',
            name: editFullName,
            website: editWebsite || '',
        });
        setLoading(false);
        getProfileData();
        closeModal();
    };
    return (
        <Box>
            <Typography variant="h6">Edit your profile</Typography>
            <Grid container spacing={3} sx={{ mb: 2, mt: 1 }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        onChange={(e) => {
                            setEditFullName(e.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Website" onChange={(e) => setEditWebsite(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <TextField multiline fullWidth label="Description" onChange={(e) => setEditDescription(e.target.value)} />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button sx={{ mr: 2 }} variant="outlined" onClick={closeModal}>
                    Cancel
                </Button>
                <ButtonLoading isLoading={loading} muiProps={{ variant: 'contained', onClick: handlePostInfo }}>
                    Submit
                </ButtonLoading>
            </Box>
        </Box>
    );
}
