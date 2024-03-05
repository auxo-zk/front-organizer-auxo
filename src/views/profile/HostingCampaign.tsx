import { Box, Button, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { THostingCampaign, fetchHostingCampaign } from 'src/services/profile/api';
import { useWalletData } from 'src/states/wallet';

export default function HostingCampaign() {
    const { userAddress } = useWalletData();
    const [hostingCampaign, setHostingCampaign] = useState<THostingCampaign[]>([]);
    console.log('🚀 ~ HostingCampaign ~ hostingCampaign:', hostingCampaign);
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
        </Box>
    );
}
