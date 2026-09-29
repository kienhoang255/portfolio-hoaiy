import { useNavigate, useParams } from "react-router";
import styles from './branding.module.css'
import data from '../../assets/data/branding.json'
import btnBack from '../../assets/icons/btn-back.svg'
import btnBack2 from '../../assets/icons/btn-back-2.svg'
import LazyImage from "~/components/lazyImg/lazyImg";
import ContactCard from "~/components/contactCard/contactCard";
import overlayImg from '../../assets/images/overlay.webp'
import { playClickSound } from "~/utils/playClickSound";

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
        playClickSound();
        navigate(`/branding`);
    }

    return (
        <div className={styles['container-project']}>
            <img className={styles.overlay} src={overlayImg} alt="" />
            <div className={styles.content_wrapper}>
                <div className={`${styles['header-project']} fadeIn`}>
                    <div className={`${styles["btn-back"]} pointer`} onClick={() => goBack()}>
                        <img src={btnBack} alt="button back" className="pointer" />
                        <img src={btnBack2} alt="" className={styles["btn-back-hover"]} />
                    </div>
                    <div className={styles.about}>
                        <strong>&#x2022; Client: <div>{project.client}</div></strong>
                        <br />
                        <div className={styles.industry}>&#x2022; Industry: <span>{project.industry}</span></div>
                        <div >&#x2022; Project scope: <span>{project.project_scope}</span></div>
                    </div>
                </div>

                <div className={`${styles.content} fadeIn`}>
                    {project.images.map((name, i) => {
                        return (
                            <LazyImage minScale={0.7}
                                className={styles.image}
                                key={i}
                                src={`${import.meta.env.BASE_URL}assets/images/${name}`}
                                alt={name}
                            />
                        );
                    })}
                </div>
                <div className='contact_card_wrapper'><ContactCard></ContactCard></div>
            </div>
        </div>
    );
}
