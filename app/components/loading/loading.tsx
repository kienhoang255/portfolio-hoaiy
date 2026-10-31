import styles from './loading.module.css';
import loading1 from '../../assets/icons/loading-1.svg';
import loading2 from '../../assets/icons/loading-2.svg';

type LoadingProps = {
    theme?: 'light' | 'dark';
    progress: number;
};

export default function Loading({ theme = 'light', progress }: LoadingProps) {
    const progressValue = Number.isFinite(progress)
        ? Math.min(100, Math.max(0, progress))
        : 0;

    return (
        <div className={styles.loading_wrapper} style={{ backgroundColor: theme === 'light' ? 'rgba(254, 253, 252, 1)' : 'rgba(21, 21, 21, 1)' }}>
            <div className={styles.content}>
                <img src={theme === 'light' ? loading1 : loading2} alt="" />
                <div
                    className={styles.progress}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progressValue}
                >
                    <div className={styles.progressFill} style={{ width: `${progressValue}%` }} />
                </div>
            </div>
        </div>
    );
}
