import data from '../../assets/data/photography.json'
import styles from './photography.module.css'
import overlayImg from '../../assets/images/overlay.webp'
import ContactCard from '~/components/contactCard/contactCard';
import PhotoCarousel from '~/components/photoCarousel/photoCarousel';

export default function Photography() {
    const projects: string[] = (data as any).images ?? []

    return (
        <div className={styles.container}>
            <img className={styles.overlay} src={overlayImg} alt="" />
            <div className={styles.carousel_section}>
                <PhotoCarousel images={projects} />
            </div>
            <div className={styles.contact_card_wrapper}><ContactCard dark={true} invertButton={true}></ContactCard></div>
        </div>
    );
}