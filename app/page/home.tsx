import { useEffect, useState } from 'react'
import portfolioImg from '../assets/images/portfolio.png'
import folderPagerImg from '../assets/images/folder-paper.png'
import cvHiddenImg from '../assets/images/cv-hidden.png'
import cvShowImg from '../assets/images/cv-show.png'
import './home.css'

export default function Home() {
    const [showCv, setShowCv] = useState(false)

    useEffect(() => {
        const scrollEl = document.querySelector('.layout-wrapper') as HTMLElement
        let lastScrollTop = 0

        const handleScroll = () => {
            const scrollTop = scrollEl.scrollTop
            const totalScrollable = scrollEl.scrollHeight - scrollEl.clientHeight
            const progress = totalScrollable > 0 ? scrollTop / totalScrollable : 0

            const isScrollingUp = scrollTop < lastScrollTop  // đang cuộn lên

            if (isScrollingUp && progress <= 0.2) {
                setShowCv(false)
            }

            lastScrollTop = scrollTop
        }

        scrollEl?.addEventListener('scroll', handleScroll)
        return () => scrollEl?.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <div className='home-container'>
                <div className='home-header'>
                    <div className="home-banner">
                        <div className="home-name">Nguyen Hoai Y</div>
                        <div className="home-jobtitle">Multi - Design</div>
                    </div>
                    <img className='home-banner-img' src={portfolioImg} alt="" />
                    <div className='home-footer'>(2026)</div>
                </div>

                <div className="home-cv">
                    <img
                        className={`cv-folder ${showCv ? 'hidden' : ''}`}
                        src={folderPagerImg}
                        alt="Open CV folder"
                        onClick={() => setShowCv(true)}
                    />
                    <img
                        className={`cv-hidden ${showCv ? 'hidden' : ''}`}
                        src={cvHiddenImg}
                        alt=""
                    />
                    <img
                        className={`cv-show ${showCv ? 'visible' : ''}`}
                        src={cvShowImg}
                        alt="CV displayed"
                    />
                </div>
            </div>
        </>
    );
}
