import { Typography, Box, Grid } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useCampaignData, useCampaignFunctions } from 'src/states/campaign';

export default function Timeline() {
    const { setCampaignData } = useCampaignFunctions();
    const { name, description, privateFunding, applicationTimeStart, allocationTimeStart, investmentTimeStart } = useCampaignData();
    return (
        <>
            <Typography variant="h6" mt={2} mb={4}>
                Time line
            </Typography>

            <Grid container spacing={1}>
                <Grid item xs={1}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Box className="timeline-dot" sx={{ mb: 0.25 }} />
                        <BoxLink height="42px" step={3} />
                        <Box className="timeline-dot" sx={{ my: 0.25 }} />
                        <BoxLink height="42px" step={3} />
                        <Box className="timeline-dot" sx={{ mt: 0.25 }} />
                    </Box>
                </Grid>
                <Grid item xs={11}>
                    <Box className="timeline-row">
                        <Typography width={'180px'} variant="body1">
                            Application Period
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Start at time"
                                sx={{ mr: 3 }}
                                minDate={dayjs(Date.now())}
                                onChange={(value: Dayjs | null, _: any) => {
                                    setCampaignData({ applicationTimeStart: value?.toDate().toISOString() || '' });
                                }}
                            />

                            {/* <DateTimePicker
                                label="To"
                                onChange={(value: Dayjs | null, _: any) => {
                                    setCampaignData({ applicationTo: value?.toDate().toISOString() || '' });
                                }}
                            /> */}
                        </LocalizationProvider>
                    </Box>
                    <Box className="timeline-row">
                        <Typography width={'180px'} variant="body1">
                            Investment Period
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Start at time"
                                minDate={dayjs(applicationTimeStart).add(1, 'day')}
                                sx={{ mr: 3 }}
                                onChange={(value: Dayjs | null, _: any) => {
                                    setCampaignData({ investmentTimeStart: value?.toDate().toISOString() || '' });
                                }}
                            />
                            {/* <DateTimePicker
                                label="To"
                                onChange={(value: Dayjs | null, _: any) => {
                                    setCampaignData({ investmentTo: value?.toDate().toISOString() || '' });
                                }}
                            /> */}
                        </LocalizationProvider>
                    </Box>
                    <Box className="timeline-row">
                        <Typography width={'180px'} variant="body1">
                            Allocation Period
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Start at time"
                                minDate={dayjs(investmentTimeStart).add(1, 'day')}
                                sx={{ mr: 3 }}
                                onChange={(value: Dayjs | null, _: any) => {
                                    setCampaignData({ allocationTimeStart: value?.toDate().toISOString() || '' });
                                }}
                            />
                            {/* <DateTimePicker
                                label="To"
                                onChange={(value: Dayjs | null, _: any) => {
                                    setCampaignData({ allocationTo: value?.toDate().toISOString() || '' });
                                }}
                            /> */}
                        </LocalizationProvider>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}

export function BoxLink({ step, height }: { step: number; height?: string }) {
    return <Box sx={{ m: 0, width: '2x', height: height || '24px', p: 0, border: step === 3 ? '1px solid #2C978F' : '1px dashed #818181' }}></Box>;
}
