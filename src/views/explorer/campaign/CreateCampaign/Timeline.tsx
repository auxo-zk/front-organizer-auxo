import { Typography, Box } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { useCampaignData, useCampaignFunctions } from 'src/states/campaign';

export default function Timeline() {
    const { setCampaignData, setApplicationForm } = useCampaignFunctions();
    const { name, description, privateFunding } = useCampaignData();
    return (
        <>
            <Typography variant="h6" mt={2} mb={4}>
                Time line
            </Typography>
            <Box className="timeline-row">
                <Box className="timeline-dot" />
                <Typography width={'180px'} variant="body1">
                    Application Period
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="From"
                        sx={{ mr: 3 }}
                        onChange={(value: Dayjs | null, _: any) => {
                            setCampaignData({ applicationFrom: value?.toDate().toISOString() || '' });
                        }}
                    />

                    <DateTimePicker
                        label="To"
                        onChange={(value: Dayjs | null, _: any) => {
                            setCampaignData({ applicationTo: value?.toDate().toISOString() || '' });
                        }}
                    />
                </LocalizationProvider>
            </Box>
            <Box className="timeline-row">
                <Box className="timeline-dot" />
                <Typography width={'180px'} variant="body1">
                    Investment Period
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="From"
                        sx={{ mr: 3 }}
                        onChange={(value: Dayjs | null, _: any) => {
                            setCampaignData({ investmentFrom: value?.toDate().toISOString() || '' });
                        }}
                    />
                    <DateTimePicker
                        label="To"
                        onChange={(value: Dayjs | null, _: any) => {
                            setCampaignData({ investmentTo: value?.toDate().toISOString() || '' });
                        }}
                    />
                </LocalizationProvider>
            </Box>
            <Box className="timeline-row">
                <Box className="timeline-dot" />
                <Typography width={'180px'} variant="body1">
                    Allocation Period
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="From"
                        sx={{ mr: 3 }}
                        onChange={(value: Dayjs | null, _: any) => {
                            setCampaignData({ allocationFrom: value?.toDate().toISOString() || '' });
                        }}
                    />
                    <DateTimePicker
                        label="To"
                        onChange={(value: Dayjs | null, _: any) => {
                            setCampaignData({ allocationTo: value?.toDate().toISOString() || '' });
                        }}
                    />
                </LocalizationProvider>
            </Box>
        </>
    );
}
