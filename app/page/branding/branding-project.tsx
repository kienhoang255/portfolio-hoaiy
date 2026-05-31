import { useNavigate, useParams } from "react-router";
import styles from './branding.module.css'
import data from '../../assets/data/branding.json'
import btnBack from '../../assets/icons/btn-back.svg'
import LazyImage from "~/components/lazyImg/lazyImg";

type BrandingData = typeof data;
type BrandingProjectKey = Exclude<keyof BrandingData, 'routing'>;

function isBrandingProjectKey(key: string): key is BrandingProjectKey {
    return key !== 'routing' && key in data;
}

export default function Branding() {
    const navigate = useNavigate();
    const { pid } = useParams<{ pid: string }>();
    const project = pid && isBrandingProjectKey(pid) ? data[pid] : undefined;

    if (!project) {
        return <div>Project not found</div>;
    }

    function goBack() {
        navigate(`/branding`);
    }

    return (
        <div className={styles['container-project']}>
            <div className={styles['header-project']}>
                <div className={styles["btn-back"]} onClick={() => goBack()}>
                    <img src={btnBack} alt="button back" />
                </div>
                <div className={styles.about}>
                    <div>Client: <strong>{project.client}</strong></div>
                    <div>Industry: <span>{project.industry}</span></div>
                    <div>Project scope: <span>{project.project_scope}</span></div>
                </div>
            </div>

            <div className={styles.content}>
                {project.images.map((name, i) => {
                    return (
                        <LazyImage
                            className={styles.image}
                            key={i}
                            src={`../assets/images/${name}`}
                            alt={name}
                        />
                    );
                })}
            </div>
        </div>
    );
}
