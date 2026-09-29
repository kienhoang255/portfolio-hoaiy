import { useNavigate } from "react-router";
import styles from './branding.module.css'
import data from '../../assets/data/branding.json'
import brandingImg from '../../assets/images/branding.svg'
import ProjectCard from "~/components/projectCard/projectCard";
import overlayImg from '../../assets/images/overlay.webp'
import { playClickSound } from '~/utils/playClickSound';

export default function Branding() {
    const navigate = useNavigate();
    const projects = data.routing

    function goToProject(pid: string) {
        navigate(`/branding/${pid}`);
    }

    return (
        <div className={styles.container}>
            <img className={styles.overlay} src={overlayImg} alt="" />
            <div className={styles.title}>
                <img src={brandingImg} className={"fadeIn blur-left-to-right-noise"} alt="" />
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
