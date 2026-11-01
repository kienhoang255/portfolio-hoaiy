import data from '../../assets/data/photography.json'
import styles from './photography.module.css'
import overlayImg from '../../assets/images/overlay.webp'
import ContactCard from '~/components/contactCard/contactCard';
import PhotoCarousel, { type PhotoItem } from '~/components/photoCarousel/photoCarousel';
import Header from '~/components/header';
import Loading from '~/components/loading/loading';
import { useImagesReady } from '~/hooks/useImagesReady';
import { AnimatePresence } from 'framer-motion';

export default function Photography() {
    const projects: PhotoItem[] = (data as any).images ?? []
    const { progress, ready } = useImagesReady([
        overlayImg,
        ...projects.map((it) =>
            `${import.meta.env.BASE_URL}assets/images/photography/${typeof it === 'string' ? it : it.src}`),
    ]);

    return (
        <div className={styles.container}>
            <AnimatePresence>
                {!ready && <Loading theme="dark" progress={progress} />}
            </AnimatePresence>
            <img className={styles.overlay} src={overlayImg} alt="" />
            <Header theme='dark'></Header>
            <div className={styles.carousel_section}>
                <PhotoCarousel images={projects} />
            </div>
            <div className={styles.banner}>
                <div className={styles.title}>A way of seeing</div>
                <div className={styles.sub_title}>If you find it beautiful, then it is beautiful</div>
            </div>
            <div className='contact_card_wrapper fadeIn'><ContactCard dark={true} invertButton={true}></ContactCard></div>
        </div>
    );
}