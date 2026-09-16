import styles from './projectCard.module.css';
import { playClickSound } from '~/utils/playClickSound';

type Project = {
    id: string;
    title: string;
    desc: string;
    placeholderImg?: string;
    kicker?: string;
};

type ProjectCardProps = {
    project: Project;
    onClick?: () => void;
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
    const imageSrc = project.placeholderImg
        ? `${import.meta.env.BASE_URL}assets/images/${project.placeholderImg}`
        : '';

    const handleClick = () => {
        if (onClick) {
            playClickSound();
            onClick();
        }
    };

    return (
        <article className={styles['project-card']} onClick={handleClick}>
            <div className={styles['project-card-image']}>
                <img src={imageSrc} alt="" />
            </div>

            <div className={styles['project-card-copy']}>
                <div className={styles['project-card-kicker']}>{project.kicker}</div>
                <h3 className={styles['project-card-title']}>{project.title}</h3>
                <p className={styles['project-card-description']}>{project.desc}</p>
            </div>
        </article>
    );
}
