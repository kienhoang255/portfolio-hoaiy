import { EffectCards } from 'swiper/modules';

import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-cards';

import './swiper.css';
import LazyImage from '../lazyImg/lazyImg';

interface SwiperJsProps {
    imgs: Array<string>;
}

const SwiperJs: React.FC<SwiperJsProps> = ({ imgs }) => {
    const listImg: Array<string> = imgs
    return (
        <>
            <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards]}
                className="mySwiper"
            >
                {listImg.map((name: any, i: number) => {
                    return (
                        <SwiperSlide key={i}>
                            <LazyImage
                                key={i}
                                src={`../assets/images/${name}`}
                                alt={name}
                            />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </>
    );
}

export default SwiperJs