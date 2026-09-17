import { useState } from 'react'
import darkBg from '../../assets/images/contact-card-dark.png'
import lightBg from '../../assets/images/contact-card-light.png'
import phoneIcon from '../../assets/images/phone-icon.png'
import phoneLightIcon from '../../assets/images/phone-icon-light.png'
import emailIcon from '../../assets/images/email-icon.png'
import emailLightIcon from '../../assets/images/email-icon-light.png'
import arrowIcon from '../../assets/icons/arrow.svg'
import styles from './contactCard.module.css'
import { motion } from 'framer-motion';
import overlayImg from '../../assets/images/overlay2.webp'
import { playClickSound } from '~/utils/playClickSound';
import Tooltip from '../tooltip/tooltip'

type ContactCardProps = {
    dark?: false
}

export default function ContactCard({ dark }: ContactCardProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    function openCard() {
        playClickSound();
        setIsClosing(false)
        setIsOpen(true)
    }

    function closeCard() {
        playClickSound();
        setIsClosing(true)
        window.setTimeout(() => {
            setIsOpen(false)
            setIsClosing(false)
        }, 600)
    }

    return (
        <>
            {!isOpen && !isClosing &&
                <motion.div layoutId="contact-box" className={`${styles.button} pointer`} onClick={openCard}>
                    <img className={styles['contact-card-overlay']} src={overlayImg} alt="" loading='lazy' />
                    Meet your designer
                    <img className={styles.arrow} src={arrowIcon} alt="" loading='lazy' />
                </motion.div>
            }

            {isOpen &&
                <motion.div layoutId="contact-box" className={`${styles.card} ${isClosing ? styles.cardClosing : ''}`}>
                    <div className={`${styles.close} pointer`} onClick={closeCard}>Close X</div>
                    <img src={dark ? darkBg : lightBg} alt="" loading='lazy' />
                    <div className={styles.info}>
                        <Tooltip text={'click to copy'}>
                            <div className={styles['info-item']}>
                                <img src={dark ? phoneIcon : phoneLightIcon} alt="" loading='lazy' />
                                0948 736 606
                            </div>
                        </Tooltip>
                        <Tooltip text={'click to copy'}>
                            <div className={styles['info-item']}>
                                <img src={dark ? emailIcon : emailLightIcon} alt="" loading='lazy' />
                                hoaiynguyen138@gmail.com
                            </div>
                        </Tooltip>
                    </div>
                </motion.div>
            }
        </>
    )
}
