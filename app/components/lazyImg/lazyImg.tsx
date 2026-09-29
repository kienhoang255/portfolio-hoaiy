import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    minScale?: number;
    range?: number; // 1 = đạt minScale khi tâm ảnh chạm mép viewport; nhỏ hơn = nhỏ sớm hơn
}

const LazyImage: React.FC<LazyImageProps> = ({
    src, alt, className, minScale = 0.8, range = 1,
}) => {
    const [isInView, setIsInView] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    // Lazy load (giữ nguyên logic cũ)
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '50px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isInView) return;
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoaded(true);
    }, [isInView, src]);

    // Hiệu ứng scale theo khoảng cách tới tâm viewport
    useEffect(() => {
        if (!isLoaded) return;

        let rafId = 0;

        const update = () => {
            rafId = 0;
            const wrapper = wrapperRef.current;
            const img = imgRef.current;
            if (!wrapper || !img) return;

            const rect = wrapper.getBoundingClientRect();
            const vh = window.innerHeight;

            // Phần ảnh đã trượt ra ngoài mép trên / mép dưới viewport (px)
            const overflowTop = Math.max(0, -rect.top);
            const overflowBottom = Math.max(0, rect.bottom - vh);

            // Nếu ảnh cao hơn viewport thì luôn có một phần tràn ra ngoài,
            // trừ phần tràn "tự nhiên" này đi để ảnh ở giữa vẫn là scale 1
            const baseline = Math.max(0, rect.height - vh) / 2;
            const overflow = Math.max(0, Math.max(overflowTop, overflowBottom) - baseline);

            // Đạt minScale khi ảnh đã ra ngoài một đoạn = rect.height * range
            const t = Math.min(overflow / (rect.height * range), 1);

            const scale = 1 - (1 - minScale) * t;
            img.style.transform = `scale(${scale.toFixed(4)})`;
        };

        const onScroll = () => {
            if (rafId === 0) rafId = requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true, capture: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll, { capture: true });
            window.removeEventListener('resize', onScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [isLoaded, minScale, range]);

    return (
        <div ref={wrapperRef} style={{ width: '100%' }}>
            {isLoaded ? (
                <img
                    ref={imgRef}
                    className={className}
                    src={src}
                    alt={alt}
                    style={{
                        width: '48vw',
                        height: 'auto',
                        display: 'block',
                        transformOrigin: 'center center',
                        transition: 'transform 0.15s ease-out', // làm mượt thêm giữa các frame
                        willChange: 'transform',
                    }}
                />
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '250px',
                        backgroundColor: '#f5f5f5',
                        display: 'block',
                    }}
                />
            )}
        </div>
    );
};

export default LazyImage;