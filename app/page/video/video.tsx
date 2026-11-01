import { useNavigate } from 'react-router';
import data from '../../assets/data/video.json'
import styles from './video.module.css'
import titleImg from '../../assets/images/video-design.svg'
import ProjectCard from '~/components/projectCard/projectCard';
import { playClickSound } from '~/utils/playClickSound';
import overlayImg from '../../assets/images/overlay.webp'
import Loading from '~/components/loading/loading';
import { AnimatePresence } from 'framer-motion';
import { useImagesReady } from '~/hooks/useImagesReady';

export default function Video() {
    const navigate = useNavigate();
    const projects = data.routing;
    const { progress, ready } = useImagesReady([
        overlayImg,
        titleImg,
        ...projects.map((p) => `${import.meta.env.BASE_URL}assets/images/${p.placeholderImg}`),
    ]);

    function goToProject(pid: string) {
        navigate(`/video/${pid}`);
    }

    return (
        <div className={styles.container}>
            <AnimatePresence>
                {!ready && <Loading theme="light" progress={progress} />}
            </AnimatePresence>
            <img className={styles.overlay} src={overlayImg} alt="" />
            <div className={`${styles.title} blur-left-to-right-noise`}>
                <img src={titleImg} className="fadeIn" alt="" style={{ width: '45vw' }} />
            </div>
            {projects.map((project, idx) => (
                <div
                    key={project.id || idx}
                    className={`${styles[`branding-card-${idx}`]} fadeIn pointer`}
                    onClick={() => {
                        playClickSound();
                        goToProject(project.id);
                    }}
                >
                    <ProjectCard project={project} />
                </div>
            ))}
        </div>
    );
}
