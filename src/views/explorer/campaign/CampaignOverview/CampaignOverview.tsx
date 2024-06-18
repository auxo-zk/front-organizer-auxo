import { Avatar, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useMemo } from 'react';
import { IconChecked, IconDone } from 'src/assets/svg/icon';

import { TCampaignData, TCampaignDetail } from 'src/services/campaign/api';
import { formatDate } from 'src/utils/format';

export default function CampaignOverview({ data }: { data: TCampaignDetail['overview'] }) {
    const activeSteps = useMemo(() => {
        const timeNow = Date.now();
        if (timeNow > data.timeline.startRequesting) return 2;
        if (timeNow > data.timeline.startFunding) return 1;
        if (timeNow > data.timeline.startParticipation) return 0;

        return 0;
    }, [data]);
    return (
        <Box>
            <Grid container sx={{ mt: 2 }} spacing={2}>
                <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
                    <Avatar src="" alt="" sx={{ width: '96px', height: '96px', mr: 3 }} />
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Box>
                                <Typography variant="body1">Organizer</Typography>
                                <Typography variant="h6">Pi network</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1">Capacity</Typography>
                                <Typography variant="h6">15/20 projects</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical' }}
                            >
                                {data.description}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box ml={3}>
                        <Typography color={'text.secondary'} mb={1}>
                            Timeline
                        </Typography>
                        <StepView
                            activeStep={activeSteps}
                            steps={[
                                { title: 'Participation', content: `Start at: ${formatDate(Number(data.timeline.startParticipation || 0), 'MMMM dd, YYY')}` },
                                { title: 'Investment', content: `Start at: ${formatDate(Number(data.timeline.startFunding || 0), 'MMMM dd, YYY')}` },
                                { title: 'Allocation', content: `Start at: ${formatDate(Number(data.timeline.startRequesting || 0), 'MMMM dd, YYY')}` },
                            ]}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Box>
                <Typography variant="h6" mt={4} mb={1}>
                    Participating Projects
                </Typography>
            </Box>
        </Box>
    );
}
function StepView({ steps, activeStep }: { steps: { title: string; content: string }[]; activeStep: number }) {
    return (
        <Box>
            {steps.map((item, index) => {
                const IconStep =
                    index < activeStep ? (
                        <IconDone sx={{ fontSize: '24px', color: 'primary.light' }} />
                    ) : index == activeStep ? (
                        <Box sx={{ border: '2px solid', width: '24px', height: '24px', borderRadius: '50%', borderColor: 'primary.light' }} />
                    ) : (
                        <Box sx={{ border: '1px solid', width: '24px', height: '24px', borderRadius: '50%', borderColor: 'text.primary' }} />
                    );
                return (
                    <Box key={'step' + item.title + index}>
                        <Box sx={{ display: 'flex', placeItems: 'center', gap: 3 }}>
                            <Box sx={{ display: 'flex', placeItems: 'center', gap: 1.3 }}>
                                {IconStep}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        minWidth: '140px',
                                        fontWeight: index < activeStep ? 700 : 500,
                                        color: index < activeStep ? 'primary.light' : index == activeStep ? 'text.primary' : 'text.secondary',
                                    }}
                                >
                                    {item.title}
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: '400', color: index < activeStep ? 'primary.light' : index == activeStep ? 'text.primary' : 'text.secondary' }}>
                                {item.content}
                            </Typography>
                        </Box>
                        {index < steps.length - 1 ? (
                            <Box sx={{ height: '40px', width: '24px', justifyContent: 'center', display: 'flex' }}>
                                <Box
                                    sx={{
                                        width: '0px',
                                        height: '100%',
                                        border: index < activeStep ? '0.5px solid' : '0.5px dashed',
                                        borderColor: index < activeStep ? 'primary.light' : 'text.secondary',
                                    }}
                                ></Box>
                            </Box>
                        ) : null}
                    </Box>
                );
            })}
        </Box>
    );
}
