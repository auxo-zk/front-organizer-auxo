import { Box, Button, MenuItem, Select, Typography } from '@mui/material';

const mockOptions = [
    {
        label: 'Mina hackathon 1',
        value: 1,
    },
    {
        label: 'Mina hackathon 2',
        value: 2,
    },
    {
        label: 'Mina hackathon 3',
        value: 3,
    },
];

export default function ProjectSelect() {
    return (
        <Box>
            <Typography variant="h6">Select your project</Typography>
            <Typography variant="body1">
                {`Select a project to apply for this fundraising campaignYou will be required to provide answers to the organizer's questions to complete the application process`}
            </Typography>
            <Select>
                {mockOptions.map((item, index) => {
                    return (
                        <MenuItem key={item.value} value={item.value}>
                            {item.label}
                        </MenuItem>
                    );
                })}
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="outlined">Cancel</Button>
                <Button variant="contained">Continue</Button>
            </Box>
        </Box>
    );
}
