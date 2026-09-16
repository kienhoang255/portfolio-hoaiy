import portfolioImg from '../../assets/images/portfolio.svg'
import avatarImg from '../../assets/images/avatar.webp'
import overlayImg from '../../assets/images/overlay.webp'
import './home.css'
import { useState, type WheelEvent } from 'react'
import Home2 from './home_2'
import Header from '~/components/header'
import ContactCard from '~/components/contactCard/contactCard'
import { motion, LayoutGroup } from 'framer-motion';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export default function Home() {
    const [home2Progress, setHome2Progress] = useState(0)
    const [home2Step3, setHome2Step3] = useState(false)
    const [contactOpen, setContactOpen] = useState(false)

    const handleWheel = (event: WheelEvent<HTMLElement>) => {
        if (event.deltaY === 0) return

        const direction = event.deltaY > 0 ? 1 : -1
        if (direction < 0) {
            setHome2Step3(false)
            setHome2Progress((prev) => clamp(prev - 1, 0, 1))
            return
        }

        event.preventDefault()

        if (home2Progress >= 0.40) {
            setHome2Step3(true)
            setHome2Progress(1)
            return
        }

        setHome2Step3(false)
        setHome2Progress((prev) => clamp(prev + 0.08, 0, 1))
    }

    return (
        <div className='home-scroll-shell' onWheel={handleWheel}>
            <section className='home1-panel'>
                <div className='home-container'>
                    <Header></Header>
                    <img className='home-overlay' src={overlayImg} alt="" />
                    <div className='home-banner-img'>
                        <img className='fadeIn blur-left-to-right-noise' src={portfolioImg} alt="" />
                    </div>
                    <div className='home-avatar-img'><img className='fadeInUp' src={avatarImg} alt="" /></div>
                    <LayoutGroup>
                        <div className='home-info'>
                            <motion.div layout className='fadeIn'>NGUYEN HOAI Y</motion.div>
                            <motion.div layout className='fadeIn'>MULTI-DESIGN</motion.div>
                            <motion.div layout className='fadeIn'>2026 EDITION</motion.div>
                            <motion.div layout className='home-info-resume fadeIn'>
                                <ContactCard />
                            </motion.div>
                        </div>
                    </LayoutGroup>
                </div>
            </section>

            <section className={home2Step3 ? 'home2-panel home2-animation' : 'home2-panel'} style={{ transform: `translateX(${110 - home2Progress * 110}%)` }}>
                <Home2 showContent={home2Progress} />
            </section>
        </div>
    )
}
