import { Box, Button, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconSpinLoading } from 'src/assets/svg/icon';
import NoData from 'src/components/NoData';
import { THostingCampaign, fetchHostingCampaign } from 'src/services/profile/api';
import { useWalletData } from 'src/states/wallet';
import CardCampaign from '../common/CardCampaign';
import { TCampaignData } from 'src/services/campaign/api';

export default function HostingCampaign() {
    const { userAddress } = useWalletData();
    const [hostingCampaign, setHostingCampaign] = useState<TCampaignData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await fetchHostingCampaign(userAddress);
                setHostingCampaign(result);
            } catch (error) {
                setHostingCampaign([]);
            }
            setLoading(false);
        };

        if (userAddress) {
            fetchData();
        }
    }, [userAddress]);
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 5 }}>
                <Typography variant="h6">Hosting Campaigns</Typography>
                <Link href="/explorer/campaigns/create" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <Button variant="contained">Create Campaign</Button>
                </Link>
            </Box>

            <Box>
                {loading && (
                    <Box>
                        <IconSpinLoading sx={{ fontSize: '100px' }} />
                    </Box>
                )}
                {!loading && hostingCampaign.length === 0 && (
                    <Box>
                        <NoData />
                    </Box>
                )}
                <Grid container spacing={2}>
                    {!loading &&
                        hostingCampaign.map((item, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <CardCampaign data={item} />
                            </Grid>
                        ))}
                </Grid>
            </Box>
        </Box>
    );
}
