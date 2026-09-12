import './home.css'
import Header from '~/components/header'
import overlayImg from '../../assets/images/overlay2.webp'
import avatarImg from '../../assets/images/avatar2.webp'
import birthdayIcon from '../../assets/images/birthday-icon.png'
import emailIcon from '../../assets/images/email-icon.png'
import phoneIcon from '../../assets/images/phone-icon.png'

type Home2Props = {
    showContent: number
};

export default function Home2({ showContent }: Home2Props) {
    return (
        <div className='home2-container'>
            <div className='home-container'>
                <Header theme='dark'></Header>
                <img className='home-overlay' src={overlayImg} alt="" />
                <main className='home2-content'>
                    <section className='home2-intro' aria-label='Introduction'>
                        <img className={showContent === 1 ? 'home2-avatar fadeInLeft' : 'home2-avatar'} src={avatarImg} alt="" />
                        <h1 className={showContent === 1 ? 'home2-title home2-title-animation' : 'home2-title'}>NGUYEN HOAI Y</h1>
                    </section>

                    <section className='home2-experience' aria-labelledby='experience-title'>
                        <h2 id='experience-title' className={showContent === 1 ? 'fadeInDown' : ''}>EXPERIENCE</h2>
                        <div className='experience-list'>
                            <article className={showContent === 1 ? 'experience-item fadeInRight' : 'experience-list'}>
                                <div className='experience-meta'>
                                    <time>03. 2024 - Present</time>
                                    <div className='experience-company'>GLOBAL ONLINE BRANDING</div>
                                </div>
                                <div className='experience-detail'>
                                    <h3>Multimedia Executive</h3>
                                    <p>-&gt; Designed communication materials, company's Website. Produced Tiktok/Social videos. Executed photography and videography for corporate events.</p>
                                </div>
                            </article>
                            <article className={showContent === 1 ? 'experience-item fadeInRight delay1ms' : 'experience-list'}>
                                <div className='experience-meta'>
                                    <time>03. 2024 - Present</time>
                                    <div className='experience-company'>GSOFT SOFTWARE CORPORATION <small>(A group entity alongside GOBRANDING)</small></div>
                                </div>
                                <div className='experience-detail'>
                                    <h3>Multimedia Executive</h3>
                                    <p>-&gt; Executed UX/UI design for the company's core software products. Designed company's Website, Corporate Brand Identity, print/digital collateral.</p>
                                </div>
                            </article>
                            <article className={showContent === 1 ? 'experience-item fadeInRight delay2ms' : 'experience-list'}>
                                <div className='experience-meta'>
                                    <time>07. 2023 - 12. 2023</time>
                                    <div className='experience-company'>Natural K Beauty</div>
                                </div>
                                <div className='experience-detail'>
                                    <h3>Digital Marketing</h3>
                                    <p>-&gt; Executed social visual, produced TikTok/Social videos. Managed product visual (photography &amp; retouching).</p>
                                </div>
                            </article>
                        </div>

                        <footer className='home2-contact' aria-label='Contact information'>
                            <span className={showContent === 1 ? 'fadeInUp' : ''}><b aria-hidden='true'><img src={birthdayIcon} alt="" /></b> 26/09/2001</span>
                            <span className={showContent === 1 ? 'fadeInUp delay1ms' : ''}><b aria-hidden='true'><img src={phoneIcon} alt="" /></b> 0948 736 606</span>
                            <span className={showContent === 1 ? 'fadeInUp delay2ms' : ''}><b aria-hidden='true'><img src={emailIcon} alt="" /></b> hoaiynguyen138@gmail.com</span>
                        </footer>
                    </section>
                </main>
            </div>
        </div>
    )
}
