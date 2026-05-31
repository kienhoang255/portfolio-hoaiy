import { useNavigate } from 'react-router';
import data from '../../assets/data/social.json'
import styles from './social.module.css'

export default function Social() {
    const navigate = useNavigate();
    const projects = data.routing

    function goToProject(pid: string) {
        navigate(`/social/${pid}`);
    }

    return (
        <div className={styles.container}>
            <div className={styles['title-wrap']}>
                <div className={styles['title-neue']}>SOCIAL DESIGN</div>
                <div className={styles['title-apple']}>Social Design</div>
            </div>
            <div className={styles['project-wrapper']}>
                {projects.map((project, idx) => (
                    <div key={idx} className={styles.project} onClick={() => goToProject(project.id)}>
                        <div className={styles['img-holder']}></div>
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
