import { LinkedIn, Telegram } from '@mui/icons-material';
import { Container, Typography, Box, Button, IconButton, Modal } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconEdit } from 'src/assets/svg/icon';
import Avatar from 'src/components/Avatar/Avatar';
import { TProfileData } from 'src/services/profile/api';
import { useProfileData, useProfileFunction } from './state';
import HostingCampaign from './HostingCampaign';
import { useModalData, useModalFunction } from 'src/states/modal';
import EditForm from './EditForm';
import { useWalletData } from 'src/states/wallet';

export default function Profile() {
    const { userAddress } = useWalletData();
    const { description, name, img } = useProfileData();
    const { getProfileData, submitProfileAvatar } = useProfileFunction();

    const { openModal, setModalData } = useModalFunction();

    const handleOpenModal = () => {
        setModalData({ content: <EditForm />, open: true, title: 'Edit your profile' });
    };

    useEffect(() => {
        getProfileData();
    }, [userAddress]);
    return (
        <Box>
            <Typography variant="h1" textTransform={'uppercase'} maxWidth={'614px'}>
                Organizer Profile
            </Typography>
            <Box sx={{ display: 'flex', placeItems: 'center', gap: 4, mt: 4 }}>
                <Avatar
                    src={img}
                    size={150}
                    onChange={async (file) => {
                        console.log('🚀 ~ onChange={ ~ file:', file);
                        try {
                            if (file![0]) {
                                await submitProfileAvatar(file![0]);
                                getProfileData();
                            }
                        } catch (error) {}
                    }}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h4" fontWeight={600}>
                            {name || 'Your name'}
                        </Typography>
                        <IconButton onClick={handleOpenModal}>
                            <IconEdit color="primary" sx={{ cursor: 'pointer' }} />
                        </IconButton>
                    </Box>
                    <Typography mt={1.5}>{description || 'Describe something about yourself.'}</Typography>

                    {/* <Box sx={{ display: 'flex', gap: 1.5, placeItems: 'center', mt: 2 }}>
                        <LinkedIn fontSize="large" sx={{ color: 'primary.light' }} />
                        <Telegram fontSize="large" sx={{ color: 'primary.light' }} />
                    </Box> */}
                </Box>
            </Box>
            <HostingCampaign />
        </Box>
    );
}
