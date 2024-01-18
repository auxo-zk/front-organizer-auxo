import { ChevronLeftRounded } from '@mui/icons-material';
import { Box, Breadcrumbs, Container, Link, MenuItem, Paper, Switch, TextField, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Img from 'src/components/Img/Img';
import Timeline from './Timeline';
import { useCampaignData, useCampaignFunctions } from 'src/states/campaign';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
const ApplicationForm = dynamic(() => import('./ApplicaionForm'), { ssr: false });
const CustomEditor = dynamic(() => import('src/components/CustomEditor/CustomEditor'), { ssr: false });

export default function CreateCampaign() {
    const { setCampaignData, setApplicationForm, handleCreateCampaign } = useCampaignFunctions();
    const { name, description, privateFunding } = useCampaignData();
    return (
        <Container
            sx={(theme) => ({
                pb: 5,
                '& .timeline-row': {
                    display: 'flex',
                    alignItems: 'center',
                    my: 3,
                },
                '& .timeline-dot': { width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'background.primary', border: '2px solid ' + theme.palette.primary.light, mr: 1.5 },
            })}
        >
            <Img
                src="https://bitnews.sgp1.digitaloceanspaces.com/uploads/admin/R4LE00ioowv4m5dB_1690012540.jpg"
                alt="banner project"
                sx={{ width: '100%', height: 'auto', aspectRatio: '370/100', borderRadius: '0px 0px 12px 12px' }}
            />
            <Breadcrumbs sx={{ mt: 2 }}>
                <Link color="inherit" href="/explorer/campaigns" style={{ textDecoration: 'none', color: 'unset' }}>
                    <Box sx={{ display: 'flex', placeItems: 'center' }}>
                        <ChevronLeftRounded color="primary" sx={{ fontSize: '24px' }} />
                        <Typography color={'primary.main'}>All Campaigns</Typography>
                    </Box>
                </Link>
                <Link color="inherit" href="#" style={{ textDecoration: 'none', color: 'unset' }}>
                    <Typography color={'primary.main'} fontWeight={600}>
                        {`Campaign's information editor`}
                    </Typography>
                </Link>
            </Breadcrumbs>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <Typography variant="h1">Campaign's information editor</Typography>
            <TextField
                label="Project's name"
                type="text"
                name="project_name"
                sx={{ mt: 5, mb: 3 }}
                onChange={(e) => {
                    setCampaignData({
                        name: e.target.value,
                    });
                }}
            />
            <Typography variant="h6" mt={2} mb={2}>
                Description*
            </Typography>
            <CustomEditor
                value={description}
                onChange={(value: string) => {
                    setCampaignData({ description: value });
                }}
            />
            <Box sx={{ mt: 6 }}>
                <Timeline />
            </Box>
            <Typography variant="h6" mt={6}>
                Privacy Option
            </Typography>
            <Box className="timeline-row">
                <Typography width="130px" variant="body1">
                    Private funding
                </Typography>
                <Switch
                    sx={{ mr: 9 }}
                    value={privateFunding}
                    onChange={(e, checked) => {
                        setCampaignData({ privateFunding: checked });
                    }}
                />
                <TextField sx={{ width: '300px', mr: 3 }} select label="Select DKG committee" value={0} />
                <TextField sx={{ width: '300px' }} select label="Select encryption key" value={0} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 5 }}>
                <Typography variant="h6" width="260px">
                    Capicity (Projects)
                </Typography>
                <Typography variant="h6" width="184px">
                    Funding option
                </Typography>
            </Box>
            <Box className="timeline-row">
                <TextField
                    label="Capacity"
                    sx={{ width: '140px' }}
                    onChange={(e) => {
                        setCampaignData({ capacity: Number(e.target.value) });
                    }}
                    type="number"
                />
                <TextField
                    select
                    sx={{ ml: 15, width: '300px' }}
                    label={'Funding options'}
                    onChange={(e) => {
                        setCampaignData({ fundingOption: Number(e.target.value) });
                    }}
                >
                    <MenuItem value={0}>Private grant</MenuItem>
                    <MenuItem value={1}>Public funding</MenuItem>
                </TextField>
            </Box>
            <ApplicationForm />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <ButtonLoading isLoading={false} muiProps={{ variant: 'contained', onClick: handleCreateCampaign }}>
                    Submit
                </ButtonLoading>
            </Box>
        </Container>
    );
}
