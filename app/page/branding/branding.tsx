import { useNavigate } from "react-router";
import styles from './branding.module.css'
import data from '../../assets/data/branding.json'

export default function Branding() {
    const navigate = useNavigate();
    const projects = data.routing

    function goToProject(pid: string) {
        navigate(`/branding/${pid}`);
    }

    return (
        <div className={styles.container}>
            <div className={styles['title-wrap']}>
                <div className={styles['title-neue']}>BRANDING</div>
                <div className={styles['title-apple']}>Branding</div>
            </div>
            <div className={styles['project-wrapper']}>
                {projects.map((project, idx) => (
                    <div key={idx} className={styles.project} onClick={() => goToProject(project.id)}>
                        <div className={styles['img-holder']}>
                        </div>
                        <div className={styles.description}>
                            <span className={styles.title}>{project.title}</span>
                            <span className={styles.desc}>{project.desc}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
