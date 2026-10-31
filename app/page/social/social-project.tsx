import styles from './social.module.css'
import btnBack from '../../assets/icons/btn-back.svg'
import { useNavigate, useParams } from 'react-router';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, useMotionValue, animate, type PanInfo } from 'framer-motion';
import data from '../../assets/data/social.json'

import btnBack2 from '../../assets/icons/btn-back-2.svg'
import LazyImage from "~/components/lazyImg/lazyImg";
import ContactCard from "~/components/contactCard/contactCard";
import overlayImg from '../../assets/images/overlay.webp'
import { playClickSound } from "~/utils/playClickSound";

type ProjectData = typeof data;
type ProjectProjectKey = Exclude<keyof ProjectData, 'routing'>;
// lets individual images override the shared --slide-width when sizes aren't uniform
type ProjectImage = string | { src: string; width?: string };

function isProjectProjectKey(key: string): key is ProjectProjectKey {
    return key !== 'routing' && key in data;
}

export default function Social() {
    const navigate = useNavigate();
    const { pid } = useParams<{ pid: string }>();
    const project = pid && isProjectProjectKey(pid) ? data[pid] : undefined;


    const dragContainerRef = useRef<HTMLDivElement>(null);
    const dragTrackRef = useRef<HTMLDivElement>(null);
    const [dragConstraint, setDragConstraint] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    // center offset of each slide within the track, in px (handles non-uniform widths)
    const slideCentersRef = useRef<number[]>([]);
    const x = useMotionValue(0);

    useEffect(() => {
        function updateConstraint() {
            const container = dragContainerRef.current;
            const track = dragTrackRef.current;
            if (!container || !track) return;

            // use rects (not offsetLeft) since .track has no positioned ancestor to measure offsetLeft against
            const trackRect = track.getBoundingClientRect();
            const slides = Array.from(track.children) as HTMLElement[];
            slideCentersRef.current = slides.map((el) => {
                const rect = el.getBoundingClientRect();
                return rect.left - trackRect.left + rect.width / 2;
            });

            setDragConstraint(Math.max(0, track.scrollWidth - container.offsetWidth));
        }

        updateConstraint();
        window.addEventListener('resize', updateConstraint);
        return () => window.removeEventListener('resize', updateConstraint);
    }, [project]);

    function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
        setIsDragging(false);

        const container = dragContainerRef.current;
        const centers = slideCentersRef.current;
        if (!container || centers.length === 0) return;

        const containerCenter = container.offsetWidth / 2;
        const averageStep = centers.length > 1
            ? (centers[centers.length - 1] - centers[0]) / (centers.length - 1)
            : 0;

        // flick fast enough and we aim one slide further in that direction
        const velocityBias = Math.abs(info.velocity.x) > 500
            ? (info.velocity.x < 0 ? averageStep / 2 : -averageStep / 2)
            : 0;
        const probe = containerCenter - x.get() + velocityBias;

        let newIndex = 0;
        let closestDistance = Infinity;
        centers.forEach((center, i) => {
            const distance = Math.abs(center - probe);
            if (distance < closestDistance) {
                closestDistance = distance;
                newIndex = i;
            }
        });

        const target = Math.min(0, Math.max(-dragConstraint, containerCenter - centers[newIndex]));

        if (newIndex !== activeIndex) {
            playClickSound();
        }
        setActiveIndex(newIndex);

        animate(x, target, { type: 'spring', stiffness: 300, damping: 30 });
    }


    if (!project) {
        return <div>Project not found</div>;
    }

    function goBack() {
        playClickSound();
        navigate(`/social`);
    }

    const listImg: Array<string> = project?.images ? project?.images : []
    // project-level default slide width (falls back to the CSS default when not set in the JSON)
    const contentStyle = project.slideWidth
        ? ({ '--slide-width': project.slideWidth } as CSSProperties)
        : undefined;

    return (
        <div className={styles['container-project']}>
            <img className={styles.overlay} src={overlayImg} alt="" />
            <div className={styles.content_wrapper}>
                <div className={`${styles.content} fadeIn`} ref={dragContainerRef} style={contentStyle}>
                    <motion.div
                        className={styles.track}
                        ref={dragTrackRef}
                        drag="x"
                        style={{ x, cursor: isDragging ? 'grabbing' : 'grab' }}
                        dragConstraints={{ left: -dragConstraint, right: 0 }}
                        dragElastic={0.08}
                        dragMomentum={false}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={handleDragEnd}
                    >
                        {(project.images as ProjectImage[]).map((entry, i) => {
                            const image = typeof entry === 'string' ? { src: entry } : entry;
                            const slideStyle = image.width
                                ? ({ '--slide-width': image.width } as CSSProperties)
                                : undefined;

                            return (
                                <div
                                    className={`${styles.slide} ${i === activeIndex ? styles.active : ''}`}
                                    key={i}
                                    style={slideStyle}
                                >
                                    <div className={styles.slideInner}>
                                        <img
                                            className={`${styles.image} pointer`}
                                            src={`${import.meta.env.BASE_URL}assets/images/${image.src}`}
                                            style={{ width: image.width }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

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

                <div className={styles.contact_card_wrapper}><ContactCard></ContactCard></div>
            </div>
        </div>
    );
}
