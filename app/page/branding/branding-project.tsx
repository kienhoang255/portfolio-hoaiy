import { useNavigate, useParams } from "react-router";
import styles from './branding.module.css'
import data from '../../assets/data/branding.json'
import btnBack from '../../assets/icons/btn-back.svg'
import LazyImage from "~/components/lazyImg/lazyImg";
import ContactCard from "~/components/contactCard/contactCard";
import overlayImg from '../../assets/images/overlay.webp'

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
                    <strong>&#x2022; Client: <div>{project.client}</div></strong>
                    <br />
                    <div className={styles.industry}>&#x2022; Industry: <span>{project.industry}</span></div>
                    <div >&#x2022; Project scope: <span>{project.project_scope}</span></div>
                </div>
            </div>

            <div className={styles.content}>
                {project.images.map((name, i) => {
                    return (
                        <LazyImage
                            className={styles.image}
                            key={i}
                            src={`${import.meta.env.BASE_URL}assets/images/${name}`}
                            alt={name}
                        />
                    );
                })}
            </div>
            <ContactCard></ContactCard>
            <img className={styles.overlay} src={overlayImg} alt="" />
        </div>
    );
}
