import { Avatar, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useMemo } from 'react';
import { IconChecked } from 'src/assets/svg/icon';

import { TCampaignData, TCampaignDetail } from 'src/services/campaign/api';
import { useModalData, useModalFunction } from 'src/states/modal';
import { formatDate } from 'src/utils/format';

export default function CampaignOverview({ data }: { data: TCampaignDetail['overview'] }) {
    const { open } = useModalData();
    const { openModal, closeModal, setModalData } = useModalFunction();
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
                    <TimeLineIndicator data={data} />
                </Grid>
            </Grid>
            <Box>
                <Typography variant="h6" mt={4} mb={1}>
                    Participating Projects
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField variant="outlined" color="secondary" placeholder="Search project" />
                    <Button sx={{ minWidth: '184px' }} variant="contained">
                        Apply
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

function TimeLineIndicator({ data }: { data: TCampaignDetail['overview'] }) {
    const current = useMemo(() => {
        const currentTime = Date.now();
        if (currentTime < Number(data.application.from || 0)) {
            return 0;
        }
        if (currentTime < Number(data.application.to || 0)) {
            return 1;
        }
        if (currentTime < Number(data.investment.to || 0)) {
            return 2;
        }
        if (currentTime < Number(data.allocation.to || 0)) {
            return 3;
        }
        return 4;
    }, [data]);
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '150px' }}>
                <IconStatus text="Application" step={Math.min(current + 1, 3)} />
                <BoxLink step={Math.min(current + 1, 3)} />
                <IconStatus text="Funding" step={Math.min(current, 3)} />
                <BoxLink step={Math.min(current, 3)} />
                <IconStatus text="Allocation" step={Math.max(current - 1, 1)} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '150px', width: '350px' }}>
                <Typography ml={22} variant="h6" fontWeight={400}>
                    {formatDate(Number(data.application.from || 0), 'dd MMM')} - {formatDate(Number(data.application.to || 0), 'dd MMM')}
                </Typography>

                <Typography ml={22} variant="h6" fontWeight={400}>
                    {formatDate(Number(data.investment.from || 0), 'dd MMM')} - {formatDate(Number(data.investment.to || 0), 'dd MMM')}
                </Typography>

                <Typography ml={22} variant="h6" fontWeight={400}>
                    {formatDate(Number(data.allocation.from || 0), 'dd MMM')} - {formatDate(Number(data.allocation.to || 0), 'dd MMM')}
                </Typography>
            </Box>
        </Box>
    );
}

function IconStatus({ step, text }: { step: number; text: string }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '24px' }}>
            <Box sx={{ m: 0, width: '24px', height: '24px', p: 0, borderRadius: '50%', border: (step === 1 && '1px solid #043E35') || (step === 2 && '2px solid #2C978F') || 'none' }}>
                {step === 3 && <IconChecked sx={{ width: '24px', height: '24px' }} />}
            </Box>
            <Typography ml={3} variant="h6" fontWeight={step === 3 ? 700 : 500} color={step === 2 ? 'primary.main' : 'primary.light'}>
                {text}
            </Typography>
        </Box>
    );
}
function BoxLink({ step }: { step: number }) {
    return <Box sx={{ m: 0, width: '2x', height: '24px', p: 0, border: step === 3 ? '1px solid #2C978F' : '1px dashed #043E35' }}></Box>;
}
