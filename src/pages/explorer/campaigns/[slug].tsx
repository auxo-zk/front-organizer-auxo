import { ChevronLeft, ChevronLeftRounded } from '@mui/icons-material';
import { Box, Breadcrumbs, Container, Typography } from '@mui/material';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import React from 'react';
import ButtonGroup from 'src/components/ButtonGroup/ButtonGroup';
import Img from 'src/components/Img/Img';
import { TCampaignDetail, getCampaignOverview } from 'src/services/campaign/api';
import Campaigns from 'src/views/explorer/campaign/Campaigns';

export default function DetailCampaign({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return <Campaigns data={data} />;
}

export const getServerSideProps = (async (context) => {
    try {
        const id = context;
        const res = await getCampaignOverview('0');
        const data = res;

        return {
            props: { data },
        };
    } catch (error) {
        console.log(error);
        return { notFound: true };
    }
}) satisfies GetServerSideProps<{
    data: TCampaignDetail;
}>;
