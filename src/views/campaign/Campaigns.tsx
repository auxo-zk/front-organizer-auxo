import { Box, Container, Grid, Typography } from '@mui/material';
import CardCampaign from 'src/views/common/CardCampaign';

const campaignMock = [
    { name: 'Watcher.Guru', type: 'Public, Grants', organizer: 'Auxo', capacity: '0/40 project' },
    { name: 'Watcher.Guru', type: 'Public, Grants', organizer: 'Auxo', capacity: '0/40 project' },
    { name: 'Watcher.Guru', type: 'Public, Grants', organizer: 'Auxo', capacity: '0/40 project' },
    { name: 'Watcher.Guru', type: 'Public, Grants', organizer: 'Auxo', capacity: '0/40 project' },
    { name: 'Watcher.Guru', type: 'Public, Grants', organizer: 'Auxo', capacity: '0/40 project' },
    { name: 'Watcher.Guru', type: 'Public, Grants', organizer: 'Auxo', capacity: '0/40 project' },
];

export default function Campaigns() {
    return (
        <Box>
            <Typography variant="h1">Campaign</Typography>
            <Box mt={2.5}>
                <Grid container spacing={3.5}>
                    {campaignMock.map((item, index) => {
                        return (
                            <Grid key={'topproject' + index + item.name} item xs={12} sm={6}>
                                <CardCampaign data={item}></CardCampaign>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
}
