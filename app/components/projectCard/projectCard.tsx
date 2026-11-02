import styles from './projectCard.module.css';
import { playClickSound } from '~/utils/playClickSound';

import eyeIcon from '../../assets/icons/eye.svg'
import heartIcon from '../../assets/icons/heart-circle.svg'


type Project = {
    id: string;
    title: string;
    desc: string;
    placeholderImg?: string;
    kicker?: string;
    height?: string;
    width?: string;
    icons?: any
};

type ProjectIcon = {
    eye?: any;
    heart?: any;
}

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
            <div className={styles['project-card-image']} style={{ maxHeight: project.height || 'auto', maxWidth: project.width || 'auto' }}>
                <img src={imageSrc} alt="" style={{ height: project.height || 'auto', width: project.width || 'auto' }} />
            </div>

            <div className={styles['project-card-copy']}>
                <div className={styles['project-card-kicker']}>{project.kicker}</div>
                <h3 className={styles['project-card-title']}><pre>{project.title}</pre></h3>
                <p className={styles['project-card-description']}>{project.desc}</p>
            </div>

            {project.icons &&
                <div className={styles.icons}>
                    {project?.icons?.view && <span><img src={eyeIcon} alt="" />{project.icons.view}</span>}
                    {project?.icons?.heart && <span><img src={heartIcon} alt="" />{project.icons.heart}</span>}
                </div>
            }
        </article>
    );
}
