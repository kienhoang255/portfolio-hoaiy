import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className }) => {
    // Trạng thái xác định xem ảnh đã cuộn tới chưa
    const [isInView, setIsInView] = useState<boolean>(false);
    // Trạng thái xác định ảnh đã thực sự tải xong file từ mạng về chưa
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true); // Đánh dấu là đã cuộn tới
                        if (imgRef.current) {
                            observer.unobserve(imgRef.current);
                        }
                    }
                });
            },
            { rootMargin: '50px' } // Tải trước khi chạm màn hình 50px cho mượt
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Kích hoạt tải ngầm khi đã cuộn tới vùng chứa
    useEffect(() => {
        if (!isInView) return;

        const img = new Image();
        img.src = src;
        img.onload = () => {
            setIsLoaded(true); // Ảnh tải xong hoàn toàn mới kích hoạt render ra giao diện
        };
    }, [isInView, src]);

    return (
        <div ref={imgRef} style={{ width: '100%' }}>
            {isLoaded ? (
                // Khi ảnh đã load xong, nó tự động có tỷ lệ chuẩn của nó, không lo bị khoảng trống
                <img
                    className={className}
                    src={src}
                    alt={alt}
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                    }}
                />
            ) : (
                // Khung giữ chỗ mặc định khi chưa cuộn tới HOẶC đang tải. 
                // Chiều cao vừa phải (250px) để không bị dồn 6 ảnh, phù hợp cả mobile và PC.
                <div
                    style={{
                        width: '100%',
                        height: '250px',
                        backgroundColor: '#f5f5f5',
                        display: 'block'
                    }}
                />
            )}
        </div>
    );
};

export default LazyImage