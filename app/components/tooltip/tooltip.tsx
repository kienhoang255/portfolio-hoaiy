
import React, { useState, useRef, useId, type ReactNode, } from "react";
import styles from "./Tooltip.module.css";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
    /** Nội dung hiển thị trong tooltip. Khi giá trị này đổi, tooltip sẽ tự động cập nhật ngay lập tức. */
    text: string;
    /** Phần tử con mà tooltip sẽ bám vào (trigger) */
    children: ReactNode;
    /** Vị trí hiển thị tooltip so với trigger. Mặc định: "top" */
    position?: TooltipPosition;
    /** Thời gian chờ (ms) trước khi tooltip hiện ra. Mặc định: 150ms */
    delay?: number;
    /** Vô hiệu hoá tooltip */
    disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
    text,
    children,
    position = "top",
    delay = 150,
    disabled = false,
}) => {
    const [visible, setVisible] = useState(true);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tooltipId = useId();

    const show = () => {
        if (disabled || !text) return;
        timerRef.current = setTimeout(() => setVisible(true), delay);
    };

    const hide = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setVisible(false);
    };

    return (
        <span
            className={styles.wrapper}
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
        >
            <span aria-describedby={visible ? tooltipId : undefined}>
                {children}
            </span>

            {!disabled && text && (
                <span
                    id={tooltipId}
                    role="tooltip"
                    className={`${styles.tooltip} ${styles[position]} ${visible ? styles.visible : ""
                        }`}
                >
                    {text}
                    <span className={styles.arrow} />
                </span>
            )}
        </span>
    );
};

export default Tooltip;
