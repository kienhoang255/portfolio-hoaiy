import { useNavigate, useParams } from "react-router";
import styles from './uxui.module.css'
import data from '../../assets/data/uxui.json'
import btnBack from '../../assets/icons/btn-back.svg'
import btnBack2 from '../../assets/icons/btn-back-2.svg'
import LazyImage from "~/components/lazyImg/lazyImg";
import ContactCard from "~/components/contactCard/contactCard";
import overlayImg from '../../assets/images/overlay.webp'
import { playClickSound } from "~/utils/playClickSound";
import { div } from "framer-motion/client";

type UxuiData = typeof data;
type UxuiProjectKey = Exclude<keyof UxuiData, 'routing'>;

function isUxuiProjectKey(key: string): key is UxuiProjectKey {
    return key !== 'routing' && key in data;
}

export default function UxuiProject() {
    const navigate = useNavigate();
    const { pid } = useParams<{ pid: string }>();
    const project = pid && isUxuiProjectKey(pid) ? data[pid] : undefined;

    if (!project) {
        return <div>Project not found</div>;
    }

    function goBack() {
        playClickSound();
        navigate(`/ux-ui`);
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

                <div className={`${styles.content} fadeInUp`}>
                    <div className={styles.project_wrapper}>
                        <div className={styles.project_title}>{project.title}</div>
                        <div className={styles.project_devider}></div>
                        <div className={styles.project_sub_title}>{project.sub_title}</div>
                        <div className={styles.project_desc}>{project.desc}</div>
                        <div className={styles.project_devider}></div>
                        <div className={styles.project_sub}>
                            <div>
                                <div className={styles.project_sub_title}>ROLE:</div>
                                <div className={styles.project_sub_desc}>{project.role}</div>
                            </div>
                            <div>
                                <div className={styles.project_sub_title}>PLATFORM:</div>
                                <div className={styles.project_sub_desc}>{project.platform}</div>
                            </div>
                        </div>
                    </div>
                    {project.images.map((name, i) => {
                        if (name == '8' && project.client == 'YOMOST') {
                            return (
                                <div>123123123</div>
                            )
                        }
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
                <div className='contact_card_wrapper fadeIn'><ContactCard></ContactCard></div>
            </div>
        </div>
    );
}
