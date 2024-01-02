import { ChevronLeftRounded } from '@mui/icons-material';
import { Box, Breadcrumbs, Container, Link, Paper, Switch, TextField, Typography } from '@mui/material';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import Img from 'src/components/Img/Img';
import Timeline from './Timeline';
import ApplicationForm from './ApplicaionForm';

export default function CreateCampaign() {
    const [desciption, setDesciption] = useState<string>('');
    return (
        <Container
            sx={(theme) => ({
                pb: 5,
                '& .timeline-row': {
                    display: 'flex',
                    alignItems: 'center',
                    my: 4,
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
                        PI network
                    </Typography>
                </Link>
            </Breadcrumbs>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <Typography variant="h1">Campaign's information editor</Typography>
            <TextField label="Project's name" type="text" name="project_name" sx={{ mt: 2 }} />
            <Typography variant="h6" mt={2} mb={1}>
                Description*
            </Typography>
            <ReactQuill theme="snow" value={desciption} onChange={setDesciption} />
            <Timeline />
            <Typography variant="h6" mt={2} mb={4}>
                Privacy Option
            </Typography>
            <Box className="timeline-row">
                <Typography width="130px" variant="body1">
                    Private funding
                </Typography>
                <Switch sx={{ mr: 9 }} />
                <TextField sx={{ width: '300px', mr: 3 }} select />
                <TextField sx={{ width: '300px' }} select />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" width="260px">
                    Capicity (Projects)
                </Typography>
                <Typography variant="h6" width="184px">
                    Capicity (Projects)
                </Typography>
            </Box>
            <Box className="timeline-row">
                <TextField label="Capacity" sx={{ width: '140px' }} />
                <TextField select sx={{ ml: 15, width: '300px' }} />
            </Box>
            <ApplicationForm />
        </Container>
    );
}
