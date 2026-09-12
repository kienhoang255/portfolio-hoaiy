import portfolioImg from '../../assets/images/portfolio.png'
import avatarImg from '../../assets/images/avatar.webp'
import overlayImg from '../../assets/images/overlay.webp'
import './home.css'
import { useState, type WheelEvent } from 'react'
import Home2 from './home_2'
import Header from '~/components/header'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export default function Home() {
    const [home2Progress, setHome2Progress] = useState(0)

    const handleWheel = (event: WheelEvent<HTMLElement>) => {
        if (event.deltaY === 0) return

        console.log(event.deltaY);

        const direction = event.deltaY > 0 ? 1 : -1
        if (direction < 0) {
            setHome2Progress((prev) => clamp(prev - 1, 0, 1))
            return
        }

        event.preventDefault()

        if (home2Progress >= 0.40) {
            setHome2Progress(1)
            return
        }

        setHome2Progress((prev) => clamp(prev + 0.08, 0, 1))
    }

    return (
        <div className='home-scroll-shell' onWheel={handleWheel}>
            <section className='home1-panel'>
                <div className='home-container'>
                    <Header></Header>
                    <img className='home-overlay' src={overlayImg} alt="" />
                    {/* <div className='home-header'> */}
                    <div className='home-banner-img'><img className='fadeInUp' src={portfolioImg} alt="" /></div>
                    <div className='home-avatar-img'><img className='fadeInUp' src={avatarImg} alt="" /></div>
                    {/* </div> */}

                    <div className='home-info'>
                        <div className='fadeIn'>NGUYEN HOAI Y</div>
                        <div className='fadeIn'>MULTI-DESIGN</div>
                        <div className='fadeIn'>2026 EDITION</div>
                        <div className='home-info-resume fadeIn'>
                            Meet your designer
                        </div>
                    </div>
                </div>
            </section>

            <section className='home2-panel' style={{ transform: `translateX(${110 - home2Progress * 110}%)` }}>
                <Home2 showContent={home2Progress} />
            </section>
        </div>
    )
}
