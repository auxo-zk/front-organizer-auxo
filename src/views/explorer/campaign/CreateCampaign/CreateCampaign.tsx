import { ChevronLeftRounded } from '@mui/icons-material';
import { Autocomplete, Box, Breadcrumbs, Container, Link, MenuItem, Paper, Switch, TextField, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import Timeline from './Timeline';
import { useCampaignData, useCampaignFunctions } from 'src/states/campaign';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
import BannerInput from './BannerInput';
const ApplicationForm = dynamic(() => import('./ApplicaionForm'), { ssr: false });
const CustomEditor = dynamic(() => import('src/components/CustomEditor/CustomEditor'), { ssr: false });
import { imagePath } from 'src/constants/imagePath';
import Avatar from 'src/components/Avatar/Avatar';
import { useEffect, useState } from 'react';
import { RTCommitteeKey, TCommitteeData, getCommiteeKeys, getListCommittees } from 'src/services/services';
import { formatAddress } from 'src/utils/format';

export default function CreateCampaign() {
    const { setCampaignData, handleCreateCampaign } = useCampaignFunctions();
    const [loading, setLoading] = useState<boolean>(false);
    const { name, description, privateFunding, avatarFile, avatar, committeeId, fundingOption } = useCampaignData();
    const [commitees, setCommitees] = useState<TCommitteeData[]>([]);
    const [keys, setKeys] = useState<RTCommitteeKey[]>([]);

    useEffect(() => {
        const fetchCommitee = async () => {
            try {
                const result = await getListCommittees();
                setCommitees(result);
            } catch (error) {
                setCommitees([]);
            }
        };
        fetchCommitee();
    }, []);

    useEffect(() => {
        const fetchKeys = async () => {
            try {
                if (committeeId) {
                    //fetch keys
                    const keysResult = await getCommiteeKeys(committeeId);
                    console.log('keysResult', keysResult);
                    setKeys(keysResult);
                } else {
                    throw new Error('No committeeId found');
                }
            } catch (err) {
                setKeys([]);
            }
        };
        fetchKeys();
    }, [committeeId]);

    return (
        <Container
            sx={(theme) => ({
                pb: 5,
                '& .timeline-row': {
                    display: 'flex',
                    alignItems: 'center',
                    my: 3,
                },
                '& .timeline-dot': { width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'background.primary', border: '2px solid ' + theme.palette.primary.light },
            })}
        >
            <Box sx={{ position: 'relative', mb: 9 }}>
                <BannerInput img={imagePath.DEFAULT_BANNER.src} />
                <Box sx={{ position: 'absolute', left: '20px', bottom: '-50px', borderRadius: '50%', border: '4px solid #FFFFFF' }}>
                    <Avatar
                        src={avatar || imagePath.DEFAULT_AVATAR.src}
                        size={100}
                        onChange={(files) => {
                            const file = files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    setCampaignData({ avatar: reader.result as string, avatarFile: file });
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                </Box>
            </Box>
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
                label="Campaign's name"
                type="text"
                name="Campaign_name"
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
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '', xsm: '', md: '2fr minmax(200px, 3fr) minmax(200px, 3fr)' }, columnGap: 3, rowGap: 2 }} mt={1}>
                <Box display={'flex'} sx={{ placeItems: 'center', minWidth: 'max-content' }}>
                    <Typography variant="body1">Private funding</Typography>
                    <Switch
                        sx={{ ml: 2 }}
                        checked={privateFunding}
                        onChange={(e, checked) => {
                            setCampaignData({ privateFunding: checked });
                        }}
                    />
                </Box>
                <Box sx={{ minWidth: '200px' }}>
                    <Autocomplete
                        fullWidth
                        options={commitees.map((i) => ({ label: i.name, value: i.idCommittee }))}
                        renderInput={(params) => <TextField {...params} label="Select DKG committee" />}
                        onChange={(e, value) => {
                            setCampaignData({ committeeId: value?.value || '' });
                        }}
                    />
                </Box>
                <Box sx={{ minWidth: '200px' }}>
                    <Autocomplete
                        fullWidth
                        disabled={!Boolean(committeeId)}
                        options={keys.map((i) => ({ label: formatAddress(i.key, 6, 6), value: i.keyId }))}
                        renderInput={(params) => <TextField {...params} label="Select encryption key" />}
                        onChange={(e, value) => {
                            setCampaignData({ keyId: String(value?.value) });
                        }}
                    />
                </Box>
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
                    value={fundingOption}
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
                <ButtonLoading
                    isLoading={loading}
                    muiProps={{
                        variant: 'contained',
                        onClick: async () => {
                            setLoading(true);
                            await handleCreateCampaign();
                            setLoading(false);
                        },
                    }}
                >
                    Submit
                </ButtonLoading>
            </Box>
        </Container>
    );
}
