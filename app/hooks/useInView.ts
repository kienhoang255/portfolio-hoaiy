import { useEffect, useRef, useState } from "react";

export const CENTER_Y = "-30% 0px -30% 0px";
export const CENTER_X = "0px -50% 0px -50%";

export function useInView<T extends Element>(threshold = 0.15, rootMargin = "0px") {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                observer.disconnect();
            }
        }, { threshold, rootMargin });
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return { ref, inView };
}
