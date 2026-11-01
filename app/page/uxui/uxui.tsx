import data from '../../assets/data/uxui.json'
import styles from './uxui.module.css'
import titleImg from '../../assets/images/uxui.svg'
import overlayImg from '../../assets/images/overlay.webp'
import { useNavigate } from 'react-router';
import { playClickSound } from '~/utils/playClickSound';
import ProjectCard from '~/components/projectCard/projectCard';
import Loading from '~/components/loading/loading';
import { useImagesReady } from '~/hooks/useImagesReady';
import { AnimatePresence } from 'framer-motion';

export default function Uxui() {
    const navigate = useNavigate();
    const projects = data.routing
    const { progress, ready } = useImagesReady([
        overlayImg,
        titleImg,
        ...projects.map((p) => `${import.meta.env.BASE_URL}assets/images/${p.placeholderImg}`),
    ]);

    function goToProject(pid: string) {
        navigate(`/ux-ui/${pid}`);
    }

    return (
        <div className={styles.container}>
            <AnimatePresence>
                {!ready && <Loading theme="light" progress={progress} />}
            </AnimatePresence>
            <img className={styles.overlay} src={overlayImg} alt="" />
            <div className={`${styles.title} blur-left-to-right-noise`}>
                <img src={titleImg} className="fadeIn" alt="" style={{ width: '37vw' }} />
            </div>
            {ready && projects.map((project, idx) => (
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
