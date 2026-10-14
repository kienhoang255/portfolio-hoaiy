import styles from './video.module.css'
import btnBack from '../../assets/icons/btn-back.svg'
import { useNavigate, useParams } from 'react-router';
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import data from '../../assets/data/video.json'

import btnBack2 from '../../assets/icons/btn-back-2.svg'
import ContactCard from "~/components/contactCard/contactCard";
import PlasticWrap, { type PlasticWrapHandle } from '~/components/plasticWrap/plasticWrap';
import videoBg from '../../assets/images/video-design/video-bg.jpg'
import videoFrame from '../../assets/images/video-design/video-frame.png'
import videoFrame2 from '../../assets/images/video-design/video-frame-2.png'
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
    const [isDragging, setIsDragging] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);
    const plasticRef = useRef<PlasticWrapHandle>(null);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const lastDragRef = useRef({ x: 0, y: 0 });

    if (!routing) {
        return <div>Project not found</div>;
    }

    function goBack() {
        playClickSound();
        navigate(`/video`);
    }

    function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
        if (isUnwrapped) return;
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
        plasticRef.current?.grab(e.clientX, e.clientY);
    }

    function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
        if (!isDragging) return;
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        lastDragRef.current = { x: dx, y: dy };
        // pulling past a third of the wrap's width counts as peeled off
        const threshold = (wrapRef.current?.offsetWidth ?? 300) * 0.3;
        const progress = Math.min(Math.hypot(dx, dy) / threshold, 1.3);
        // screen drag maps to local plane space; flip Y since dragging up means local "up" (positive)
        plasticRef.current?.setTarget(progress, dx, -dy);
    }

    function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
        if (!isDragging) return;
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
        const threshold = (wrapRef.current?.offsetWidth ?? 300) * 0.3;
        const distance = Math.hypot(lastDragRef.current.x, lastDragRef.current.y);
        if (distance > threshold) {
            playClickSound();
            setIsUnwrapped(true);
            plasticRef.current?.setTarget(1);
        } else {
            plasticRef.current?.setTarget(0);
        }
        lastDragRef.current = { x: 0, y: 0 };
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
                        ref={wrapRef}
                        className={`${styles.wrap} ${routing.frame === 'video-frame-2' ? styles.wide : ''} ${isUnwrapped ? styles.unwrapped : ''} ${isDragging ? styles.dragging : ''} ${isUnwrapped ? '' : 'pointer'}`}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                    >
                        {routing.placeholderVideo && (
                            <img
                                className={styles.poster}
                                src={`${import.meta.env.BASE_URL}assets/images/${routing.placeholderVideo}`}
                                alt={routing.title}
                                draggable={false}
                            />
                        )}
                        <img className={styles.frame} src={routing.frame === 'video-frame-2' ? videoFrame2 : videoFrame} alt="" draggable={false} />
                        <PlasticWrap
                            ref={plasticRef}
                            aspect={routing.frame === 'video-frame-2' ? 1000 / 569 : 1}
                            className={styles.wrapTexture}
                        />
                        <div className={styles.playButton} />
                    </div>
                    <div className={styles.unwrapHint}>
                        <span>&laquo;</span> Press &amp; drag to peel off the wrap!
                    </div>
                </div>

                <div className='contact_card_wrapper'><ContactCard dark={true} invertButton={true}></ContactCard></div>
            </div>
        </div>
    );
}
