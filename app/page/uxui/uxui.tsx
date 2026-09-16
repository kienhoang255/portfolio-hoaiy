import styles from './uxui.module.css'
import uxuiImg from '../../assets/images/uxui.svg'
import overlayImg from '../../assets/images/overlay.webp'

export default function Uxui() {
    return (
        <>
            <div className={styles.container}>
                <img className={styles.overlay} src={overlayImg} alt="" />
                <div className={styles.title}>
                    <img src={uxuiImg} className={"fadeIn blur-left-to-right-noise"} alt="" />
                </div>

                {/* {projects.map((project, idx) => (
                <div className={styles[`branding-card-${idx}`]} onClick={() => goToProject(project.id)}><ProjectCard key={idx} project={project}></ProjectCard></div>
            ))} */}
            </div>
        </>
    );
}
