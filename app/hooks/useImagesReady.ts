import { useEffect, useState } from 'react';

export function useImagesReady(urls: string[]) {
    const [loaded, setLoaded] = useState(0);
    const key = urls.join('|');

    useEffect(() => {
        let cancelled = false;
        setLoaded(0);
        urls.forEach((url) => {
            const img = new Image();
            img.src = url;
            // a failed image still counts as settled so progress never hangs
            img.decode().catch(() => { }).finally(() => {
                if (!cancelled) setLoaded((n) => n + 1);
            });
        });
        return () => { cancelled = true; };
    }, [key]);

    return {
        progress: urls.length ? Math.round((loaded / urls.length) * 100) : 100,
        ready: loaded >= urls.length,
    };
}
