import styles from './video.module.css'
import btnBack from '../../assets/icons/btn-back.svg'
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import data from '../../assets/data/video.json'

import btnBack2 from '../../assets/icons/btn-back-2.svg'
import ContactCard from "~/components/contactCard/contactCard";
import videoBg from '../../assets/images/video-design/video-bg.jpg'
import videoFrame from '../../assets/images/video-design/video-frame.png'
import videoFrame2 from '../../assets/images/video-design/video-frame-2.png'
import videoOverlay from '../../assets/images/video-design/video-overlay.png'
import { playClickSound } from "~/utils/playClickSound";

type ProjectData = typeof data;
type ProjectDetailKey = Exclude<keyof ProjectData, 'routing'>;

function isProjectDetailKey(key: string): key is ProjectDetailKey {
    return key !== 'routing' && key in data;
}

export default function VideoProject() {
    const navigate = useNavigate();
    const { pid } = useParams<{ pid: string }>();
    const routing = data.routing.find((item) => item.id === pid);
    const detail = pid && isProjectDetailKey(pid) ? data[pid] : undefined;
    const [isUnwrapped, setIsUnwrapped] = useState(false);

    if (!routing) {
        return <div>Project not found</div>;
    }

    function goBack() {
        playClickSound();
        navigate(`/video`);
    }

    function toggleUnwrap() {
        playClickSound();
        setIsUnwrapped((prev) => !prev);
    }

    return (
        <div className={styles['container-project']} style={{ backgroundImage: `url(${videoBg})` }}>
            <div className={styles.content_wrapper}>
                <div className={`${styles['header-project']} fadeIn`}>
                    <div className={`${styles["btn-back"]} pointer`} onClick={() => goBack()}>
                        <img src={btnBack} alt="button back" className="pointer" />
                        <img src={btnBack2} alt="" className={styles["btn-back-hover"]} />
                    </div>
                    <div className={styles.about}>
                        <strong>&#x2022; Video title: <div>{routing.title}</div></strong>
                        <br />
                        <div className={styles.industry}>&#x2022; Objective: <span>{routing.desc}</span></div>
                        <div>&#x2022; Project overview: <span>{detail?.project_overview ?? ''}</span></div>
                    </div>
                </div>

                <div className={`${styles.content} fadeIn`}>
                    <div
                        className={`${styles.wrap} ${routing.frame === 'video-frame-2' ? styles.wide : ''} ${isUnwrapped ? styles.unwrapped : ''} pointer`}
                        onClick={toggleUnwrap}
                    >
                        {routing.placeholderVideo && (
                            <img
                                className={styles.poster}
                                src={`${import.meta.env.BASE_URL}assets/images/${routing.placeholderVideo}`}
                                alt={routing.title}
                            />
                        )}
                        <img className={styles.frame} src={routing.frame === 'video-frame-2' ? videoFrame2 : videoFrame} alt="" />
                        <img className={styles.wrapTexture} src={videoOverlay} alt="" />
                        <div className={styles.playButton} />
                    </div>
                    <div className={styles.unwrapHint}>
                        <span>&laquo;</span> Unwrap to watch!
                    </div>
                </div>

                <div className='contact_card_wrapper'><ContactCard dark={true} invertButton={true}></ContactCard></div>
            </div>
        </div>
    );
}
