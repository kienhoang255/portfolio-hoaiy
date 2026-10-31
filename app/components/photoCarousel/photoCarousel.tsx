import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import './photoCarousel.css';

// string (tự đo khi load) hoặc object có sẵn w/h (khuyên dùng)
export type PhotoItem = string | { src: string; w: number; h: number };

interface PhotoCarouselProps {
    images: PhotoItem[];
    basePath?: string;
}

const SCALE_BY_STEP = [1, 0.9, 0.8, 0.7, 0.62, 0.55];
const ROT_BY_STEP = [0, 15, 20, 25, 28, 30];
const SHIFT_BY_STEP = [0, 0, 1, 2, 3, 1.5];
const DEFAULT_RATIO = 3 / 2;

export default function PhotoCarousel({
    images,
    basePath = `${import.meta.env.BASE_URL}assets/images/photography/`,
}: PhotoCarouselProps) {
    const swiperRef = useRef<SwiperType | null>(null);
    const centersRef = useRef<number[]>([]);
    const [measured, setMeasured] = useState<Record<string, number>>({});

    const items = useMemo(() => {
        const base = (images ?? []).map((it) =>
            typeof it === 'string'
                ? { src: it, ratio: undefined as number | undefined }
                : { src: it.src, ratio: it.w / it.h }
        );
        return base.length > 0 && base.length < 6 ? [...base, ...base] : base;
    }, [images]);

    // Đo tâm các slide (chỉ khi layout / loop thay đổi)
    const measure = useCallback(() => {
        const swiper = swiperRef.current;
        if (!swiper || swiper.destroyed) return;
        centersRef.current = (swiper.slides as HTMLElement[]).map(
            (el) => el.offsetLeft + el.offsetWidth / 2
        );
    }, []);

    // Mỗi frame: chỉ tính toán, không đọc DOM
    const applySizes = useCallback(() => {
        const swiper = swiperRef.current;
        if (!swiper || swiper.destroyed) return;

        const slides = swiper.slides as HTMLElement[];
        const centers = centersRef.current;
        const n = slides.length;
        if (!n || centers.length !== n) return;

        // tâm khung nhìn trong toạ độ của wrapper
        const mid = -swiper.translate + swiper.width / 2;

        // chỉ số liên tục f của slide đang nằm ở tâm
        let f: number;
        if (mid <= centers[0]) f = 0;
        else if (mid >= centers[n - 1]) f = n - 1;
        else {
            let i = 0;
            while (i < n - 2 && centers[i + 1] <= mid) i++;
            f = i + (mid - centers[i]) / (centers[i + 1] - centers[i] || 1);
        }

        const maxStep = ROT_BY_STEP.length - 1;
        for (let i = 0; i < n; i++) {
            const offset = i - f; // dương = bên phải tâm
            const distance = Math.min(Math.abs(offset), maxStep);
            const lo = Math.floor(distance);
            const hi = Math.min(lo + 1, maxStep);
            const t = distance - lo;

            const rot =
                (ROT_BY_STEP[lo] + (ROT_BY_STEP[hi] - ROT_BY_STEP[lo]) * t) * Math.sign(offset);
            const scale = SCALE_BY_STEP[lo] + (SCALE_BY_STEP[hi] - SCALE_BY_STEP[lo]) * t;

            const el = slides[i];
            const slideWidth = el.offsetWidth;
            const gap = (slideWidth * (1 - scale)) / 2;
            const shiftFactor = SHIFT_BY_STEP[lo] + (SHIFT_BY_STEP[hi] - SHIFT_BY_STEP[lo]) * t;
            const factor = Math.max(0, distance - 1) * 1;
            const shift = -Math.sign(offset) * gap * shiftFactor;
            el.style.setProperty('--shift-x', `${shift}px`);
            el.style.setProperty('--rot', `${rot.toFixed(2)}deg`);
            el.style.setProperty('--s', scale.toFixed(3));
            el.style.setProperty('--dim', Math.min(0.45, distance * 0.45).toFixed(3));
            el.style.zIndex = String(Math.max(0, 30 - Math.round(distance) * 2));
        }
    }, []);

    const remeasure = useCallback(() => {
        measure();
        applySizes();
    }, [measure, applySizes]);

    // Ảnh không có w/h: đo xong thì cho Swiper tính lại
    useEffect(() => {
        const s = swiperRef.current;
        if (!s || s.destroyed) return;
        s.update();
        remeasure();
    }, [measured, remeasure]);

    if (items.length === 0) return null;

    return (
        <div className="photo-carousel-wrap">
            <Swiper
                grabCursor
                centeredSlides
                loop
                speed={1000}
                slidesPerView="auto"
                spaceBetween={0}
                loopAdditionalSlides={4}
                keyboard={{ enabled: true }}
                modules={[Keyboard]}
                className="photo-carousel"
                onSwiper={(s) => {
                    swiperRef.current = s;
                    requestAnimationFrame(remeasure);
                }}
                onSetTranslate={applySizes}
                onResize={remeasure}
                onUpdate={remeasure}
                onLoopFix={remeasure}
            >
                {items.map((it, i) => {
                    const ratio = it.ratio ?? measured[it.src] ?? DEFAULT_RATIO;
                    return (
                        <SwiperSlide
                            key={`${it.src}-${i}`}
                            className="photo-slide"
                            style={{ '--ratio': ratio } as React.CSSProperties}
                        >
                            <div className="photo-frame">
                                <img
                                    src={`${basePath}${it.src}`}
                                    alt={`photography-${it.src}`}
                                    loading="eager"
                                    draggable={false}
                                    onLoad={(e) => {
                                        if (it.ratio) return;
                                        const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                                        if (!w || !h) return;
                                        setMeasured((m) => (m[it.src] ? m : { ...m, [it.src]: w / h }));
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}