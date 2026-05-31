import { useEffect, useState } from 'react'
import portfolioImg from '../../assets/images/portfolio.png'
import avatarImg from '../../assets/images/avatar.png'
import folderPagerImg from '../../assets/images/folder-paper.png'
import cvHiddenImg from '../../assets/images/cv-hidden.png'
import cvShowImg from '../../assets/images/cv-show.png'
import './home.css'
import { } from 'framer-motion'

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
                    <img className='home-banner-img' src={portfolioImg} alt="" />
                    <img className='home-avatar-img' src={avatarImg} alt="" />
                </div>

                <div className='home-info'>
                    <div>Nguyen Hoai Y</div>
                    <div>Multi - Design</div>
                    <div>2026</div>
                    <div className='home-info-resume'>
                        View resume
                    </div>
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
                    <div className={`cv-show ${showCv ? 'visible' : ''}`}>
                        <div className='cv-title'>Experience</div>
                        <div className='cv-company-date'>07.2023 - 12.2023</div>
                        <div className='cv-company-section'>
                            <div className='cv-company-name'>Natural K Beauty</div>
                            <div className='cv-company-jobtitle'>
                                <div>Digital Marketing</div>
                                <div>Executed social visual, produced TikTok/Social videos. Managed product visual (photography & retouching).</div>
                            </div>
                        </div>
                        <div className='cv-company-date'>03.2024 - Present</div>
                        <div className='cv-company-section'>
                            <div className='cv-company-name'>Global Online Branding</div>
                            <div className='cv-company-jobtitle'>
                                <div>Multimedia Executive</div>
                                <div>Designed communication materials, company’s Website. Produced Tiktok/Social videos. Executed photography and videography for corporate events.</div>
                            </div>
                        </div>
                        <div className='cv-company-date'>03.2024 - Present</div>
                        <div className='cv-company-section'>
                            <div className='cv-company-name'>
                                GSOFT Software Corporation
                                <div className='cv-note'>(A group entity alongside GOBRANDING)</div>
                            </div>
                            <div className='cv-company-jobtitle'>
                                <div>Multimedia Executive</div>
                                <div>Executed UX/UI design for the company's core software products. Designed company’s Website, Corporate Brand Identity, print/digital collateral.</div>
                            </div>
                        </div>
                        <div className='cv-title'>Education</div>
                        <div>
                            <span className='cv-company-date'>2019 - 2023</span>
                            <div className='cv-company-section'>
                                <div className='cv-company-jobtitle'>
                                    Ho Chi Minh City University of Social Sciences and Humanities
                                </div>
                                <div className='cv-company-jobtitle'>
                                    <span>Faculty of Journalism and Communications</span>
                                    <span>Major of Multimedia communications</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <img
                        className={`cv-show ${showCv ? 'visible' : ''}`}
                        src={cvShowImg}
                        alt="CV displayed"
                    /> */}
                </div>
            </div>
        </>
    );
}
