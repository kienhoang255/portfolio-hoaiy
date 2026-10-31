import data from '../../assets/data/uxui.json'
import styles from './uxui.module.css'
import titleImg from '../../assets/images/uxui.svg'
import overlayImg from '../../assets/images/overlay.webp'
import { useNavigate } from 'react-router';
import { playClickSound } from '~/utils/playClickSound';
import ProjectCard from '~/components/projectCard/projectCard';

export default function Uxui() {
    const navigate = useNavigate();
    const projects = data.routing

    function goToProject(pid: string) {
        navigate(`/ux-ui/${pid}`);
    }

    return (
        <div className={styles.container}>
            <img className={styles.overlay} src={overlayImg} alt="" />
            <div className={`${styles.title} blur-left-to-right-noise`}>
                <img src={titleImg} className="fadeIn" alt="" style={{ width: '37vw' }} />
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
