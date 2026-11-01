import { motion, useSpring, useTransform } from 'framer-motion';
import styles from './loading.module.css';
import loading1 from '../../assets/icons/loading-1.svg';
import loading2 from '../../assets/icons/loading-2.svg';
import { useEffect } from 'react';

type LoadingProps = {
    theme?: 'light' | 'dark';
    progress: number;
};

export default function Loading({ theme = 'light', progress }: LoadingProps) {
    const progressValue = Number.isFinite(progress)
        ? Math.min(100, Math.max(0, progress))
        : 0;

    // overdamped (damping > 2*sqrt(stiffness*mass)) nên không bị vọt quá 100%
    const spring = useSpring(0, { stiffness: 80, damping: 20, mass: 0.5 });
    const scaleX = useTransform(spring, (v) => Math.min(1, Math.max(0, v / 100)));

    useEffect(() => {
        spring.set(progressValue);
    }, [progressValue, spring]);

    return (
        <motion.div
            className={styles.loading_wrapper}
            style={{ backgroundColor: theme === 'light' ? 'rgba(254, 253, 252, 1)' : 'rgba(21, 21, 21, 1)' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            // waits for the bar to finish filling before fading out
            exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.35, ease: 'easeOut' } }}
        >
            <img src={theme === 'light' ? loading1 : loading2} alt="" />
            <div className={styles.content}>
                <div
                    className={styles.progress}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progressValue}
                >
                    <motion.div
                        className={styles.progressFill}
                        style={{ scaleX, transformOrigin: 'left center' }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
