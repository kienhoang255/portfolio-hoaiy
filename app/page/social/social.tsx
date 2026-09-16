import { useNavigate } from 'react-router';
import data from '../../assets/data/social.json'
import styles from './social.module.css'
import titleImg from '../../assets/images/social-design.svg'
import ProjectCard from '~/components/projectCard/projectCard';
import { playClickSound } from '~/utils/playClickSound';
import overlayImg from '../../assets/images/overlay.webp'

export default function Social() {
    const navigate = useNavigate();
    const projects = data.routing

    function goToProject(pid: string) {
        navigate(`/social/${pid}`);
    }

    return (
        <div className={styles.container}>
            <img className={styles.overlay} src={overlayImg} alt="" />
            <div className={styles.title}>
                <img src={titleImg} className={"fadeIn blur-left-to-right-noise"} alt="" />
            </div>

            {projects.map((project, idx) => (
                <div
                    key={project.id || idx}
                    className={styles[`branding-card-${idx}`]}
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
