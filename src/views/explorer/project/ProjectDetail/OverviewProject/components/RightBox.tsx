import { SaveAltRounded } from '@mui/icons-material';
import { Box, Divider, Typography } from '@mui/material';
import React from 'react';
import { IconFolder } from 'src/assets/svg/icon';
import StackTeamMember from 'src/components/StackTeamMember/StackTeamMember';
import { useProjectDetailData } from '../../state';

export default function RightBox() {
    const { overview } = useProjectDetailData();
    return (
        <Box sx={{ minWidth: '309px', zIndex: -1 }}>
            <Box sx={{ borderRadius: '12px', bgcolor: 'background.secondary', p: { xs: 2, xsm: 3 }, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', placeItems: 'baseline', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Documents</Typography>
                    <Box sx={{ display: 'flex', placeItems: 'end', gap: 0.5 }}>
                        <Typography variant="body3" color={'primary.main'}>
                            Download All
                        </Typography>
                        <IconFolder fontSize="small" color={'primary'} />
                    </Box>
                </Box>

                {overview?.documents?.map((item, index) => {
                    return (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', placeItems: 'center', pt: 3 }}>
                            <Typography variant="body2" color={'primary.light'}>
                                FileName.pdf
                            </Typography>
                            <SaveAltRounded sx={{ color: 'primary.light', cursor: 'pointer' }} fontSize="small" />
                        </Box>
                    );
                })}
                {overview?.documents?.length === 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', placeItems: 'center', pt: 3 }}>
                        <Typography>No Document</Typography>
                    </Box>
                )}
                <Divider sx={{ mt: 3.5 }} />
                <Box mt={2}>
                    <Typography variant="h6" mb={2.5}>
                        Team Member
                    </Typography>
                    {overview.member.map((member, index) => {
                        return (
                            <StackTeamMember
                                key={index}
                                sx={{ mb: 1 }}
                                name={member.name}
                                urlImage="https://pbs.twimg.com/profile_images/1732964434363248640/UtVeR8Io_200x200.jpg"
                                desc={member.role}
                            />
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
}
