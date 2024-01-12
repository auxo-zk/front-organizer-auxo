import { ChevronLeft } from '@mui/icons-material';
import { Box } from '@mui/material';
import React, { ReactNode } from 'react';
import Slider, { Settings, CustomArrowProps } from 'react-slick';
import { IconChevonLeft, IconChevonRight } from 'src/assets/svg/icon';

function SampleNextArrow(props: CustomArrowProps) {
    const { className, style, onClick } = props;
    return (
        <Box style={{ ...style, display: 'block', position: 'absolute', right: '-30px', top: '50%', transform: 'translateY(-50%)' }} onClick={onClick}>
            <IconChevonRight color="primary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.light' } }} />
        </Box>
    );
}

function SamplePrevArrow(props: CustomArrowProps) {
    const { className, style, onClick } = props;
    return (
        <Box style={{ ...style, display: 'block', position: 'absolute', left: '-30px', top: '50%', transform: 'translateY(-50%)' }} onClick={onClick}>
            <IconChevonLeft color="primary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.light' } }} />
        </Box>
    );
}
export default function SliderCustom({ children }: { children: ReactNode }) {
    const settings: Settings = {
        className: 'center',
        infinite: true,
        centerPadding: '0px',
        slidesToShow: 5,
        swipeToSlide: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        adaptiveHeight: true,
        variableWidth: true,
    };
    return (
        <Box sx={{ px: 4 }}>
            <Slider {...settings}>{children}</Slider>
        </Box>
    );
}
