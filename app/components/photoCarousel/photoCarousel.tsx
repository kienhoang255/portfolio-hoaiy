import { useCallback, useEffect, useMemo, useRef } from 'react';
import { EffectCoverflow, Autoplay, Navigation, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

import './photoCarousel.css';

interface PhotoCarouselProps {
    images: string[];
    basePath?: string;
}

/**
 * Bậc ưu tiên (0 = ảnh chính):
 * - Ảnh sát mép ảnh chính giữ NGUYÊN chiều cao như ảnh chính (scale = 1),
 *   các ảnh xa dần thì nhỏ dần.
 * - rotateY: ảnh sát mép nghiêng ~15°, xa dần nghiêng nhiều hơn.
 */
const SCALE_BY_STEP = [1, 1, 0.9, 0.8, 0.7, 0.62];
const ROT_BY_STEP = [0, 15, 20, 25, 28, 30];

export default function PhotoCarousel({
    images,
    basePath = `${import.meta.env.BASE_URL}assets/images/photography/`,
}: PhotoCarouselProps) {
    const swiperRef = useRef<SwiperType | null>(null);

    if (!images || images.length === 0) return null;

    // Swiper loop cần tối thiểu 2x slidesPerView, nhân đôi mảng nếu ít ảnh
    const loopImages = useMemo(
        () => (images.length < 6 ? [...images, ...images] : images),
        [images]
    );

    /**
     * Tính lại scale + rotateY cho từng slide theo khoảng cách (số bước) tới ảnh chính.
     * Ảnh ngay cạnh ảnh chính giữ nguyên kích thước, các ảnh xa hơn nhỏ dần.
     */
    const applySizes = useCallback(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        const maxStep = ROT_BY_STEP.length - 1;

        for (const el of swiper.slides as HTMLElement[]) {
            const progress: number = (el as any).progress ?? 0;
            const distance = Math.min(Math.abs(progress), maxStep);

            const lo = Math.floor(distance);
            const hi = Math.min(lo + 1, maxStep);
            const t = distance - lo;

            // progress dương = slide bên trái, nên đảo dấu để khớp với offset cũ
            const rot = (ROT_BY_STEP[lo] + (ROT_BY_STEP[hi] - ROT_BY_STEP[lo]) * t) * -Math.sign(progress);
            const scale = SCALE_BY_STEP[lo] + (SCALE_BY_STEP[hi] - SCALE_BY_STEP[lo]) * t;
            // el.style.setProperty('--dim', String(Math.min(0.45, distance * 0.45)));
            el.style.setProperty('--rot', `${rot.toFixed(2)}deg`);
            el.style.setProperty('--s', scale.toFixed(3));
            el.style.zIndex = String(Math.max(0, 30 - Math.round(distance) * 2));
        }
    }, []);

    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        const startDragging = () => swiper.el.classList.add('is-dragging');
        const endDragging = () => {
            requestAnimationFrame(() => {
                if (!swiper.animating) swiper.el.classList.remove('is-dragging');
            });
        };
        const finishTransition = () => {
            swiper.el.classList.remove('is-dragging');
            applySizes();
        };

        applySizes();
        swiper.on('slideChange', applySizes);
        swiper.on('setTranslate', applySizes);
        swiper.on('touchStart', startDragging);
        swiper.on('touchEnd', endDragging);
        swiper.on('transitionEnd', finishTransition);
        swiper.on('resize', applySizes);
        swiper.on('loopFix', applySizes);

        return () => {
            swiper.off('slideChange', applySizes);
            swiper.off('setTranslate', applySizes);
            swiper.off('touchStart', startDragging);
            swiper.off('touchEnd', endDragging);
            swiper.off('transitionEnd', finishTransition);
            swiper.off('resize', applySizes);
            swiper.off('loopFix', applySizes);
        };
    }, [applySizes]);

    return (
        <div className="photo-carousel-wrap">
            <Swiper
                effect="coverflow"
                grabCursor
                centeredSlides
                loop
                speed={650}
                slidesPerView="auto"
                spaceBetween={0}
                loopAdditionalSlides={2}
                watchSlidesProgress
                keyboard={{ enabled: true }}
                // autoplay={{
                //     delay: 2800,
                //     disableOnInteraction: false,
                //     pauseOnMouseEnter: true,
                // }}
                coverflowEffect={{
                    rotate: 0, // xoay do JS tự tính qua bien --rot
                    stretch: 0,
                    depth: 0, // khong translateZ -> anh ben canh khong bi co chieu cao
                    modifier: 1,
                    scale: 0.87, // khong scale boi coverflow, JS tu quan ly
                    slideShadows: false,
                }}
                navigation={{
                    nextEl: '.photo-nav-next',
                    prevEl: '.photo-nav-prev',
                }}
                modules={[EffectCoverflow, Autoplay, Navigation, Keyboard]}
                onSwiper={(s) => {
                    swiperRef.current = s;
                    requestAnimationFrame(applySizes);
                }}
                className="photo-carousel"
            >
                {loopImages.map((name, i) => (
                    <SwiperSlide key={`${name}-${i}`} className="photo-slide">
                        <div className="photo-frame">
                            <img
                                src={`${basePath}${name}`}
                                alt={`photography-${name}`}
                                loading={i < 3 ? 'eager' : 'lazy'}
                                draggable={false}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
