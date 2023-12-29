import { Box, Typography } from '@mui/material';

export default function NotAuthWarning() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
            <Typography variant="h2">You need to login</Typography>
        </Box>
    );
}
