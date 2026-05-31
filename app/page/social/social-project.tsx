import styles from './social.module.css'
import btnBack from '../../assets/icons/btn-back.svg'
import { useNavigate, useParams } from 'react-router';
import SwiperJs from '~/components/swiper/swiper';
import data from '../../assets/data/social.json'

type ProjectData = typeof data;
type ProjectProjectKey = Exclude<keyof ProjectData, 'routing'>;

function isProjectProjectKey(key: string): key is ProjectProjectKey {
    return key !== 'routing' && key in data;
}

export default function Social() {
    const navigate = useNavigate();
    const { pid } = useParams<{ pid: string }>();
    const project = pid && isProjectProjectKey(pid) ? data[pid] : undefined;

    function goBack() {
        navigate(`/social`);
    }

    const listImg: Array<string> = project?.images ? project?.images : []
    return (
        <div className={styles['container-project']}>
            <div className={styles['header-project']}>
                <div className={styles["btn-back"]} onClick={() => goBack()}>
                    <img src={btnBack} alt="button back" />
                </div>
            </div>
            <div className={styles.content}>
                <span>{project?.header}</span>
                <div className={styles['swiper-wrapper']}><SwiperJs imgs={listImg} /></div>
                <span>{project?.footer}</span>
            </div>
            <div className={styles.about}>
                Project Overview: <span>{project?.project_overview}</span>
            </div>
        </div>
    );
}
