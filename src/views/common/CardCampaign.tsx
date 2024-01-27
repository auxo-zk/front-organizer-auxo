import { Box, Fade, IconButton, MenuItem, Popper, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import Card from 'src/components/Card/Card';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { TCampaignData } from 'src/services/campaign/api';

export default function CardCampaign({ data }: { data: TCampaignData }) {
    return (
        <Card avatar={data.avatar} banner={data.banner}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href={`/explorer/campaigns/${data.campaignId}`} style={{ textDecoration: 'none', color: 'unset' }}>
                    <Typography variant="h6" fontWeight={600} mb={4}>
                        {data.name}
                    </Typography>
                </Link>
                <MenuButton />
            </Box>
            <Typography>
                <Typography component={'span'} fontWeight={600}>
                    Type:
                </Typography>{' '}
                {data.type}
            </Typography>
            <Typography>
                <Typography component={'span'} fontWeight={600}>
                    Capacity:
                </Typography>{' '}
                {data.capacity}
            </Typography>
        </Card>
    );
}

function MenuButton() {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
    };

    const canBeOpen = open && Boolean(anchorEl);
    const id = canBeOpen ? 'transition-popper' : undefined;

    return (
        <Box sx={{ width: '20px' }}>
            <IconButton aria-describedby={id} type="button" onClick={handleClick}>
                <MoreHorizIcon />
            </IconButton>
            <Popper sx={{ zIndex: 1000 }} placement="bottom-end" id={id} open={open} anchorEl={anchorEl}>
                <Box>
                    <MenuItem>
                        <Typography>Edit</Typography>
                    </MenuItem>
                    <MenuItem>
                        <Typography>Delete</Typography>
                    </MenuItem>
                </Box>
            </Popper>
        </Box>
    );
}
