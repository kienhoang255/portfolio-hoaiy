import { useEffect, useState } from 'react'
import darkBg from '../../assets/images/contact-card-dark.png'
import lightBg from '../../assets/images/contact-card-light.png'
import phoneIcon from '../../assets/images/phone-icon.png'
import emailIcon from '../../assets/images/email-icon.png'
import arrowIcon from '../../assets/icons/arrow.svg'
import styles from './contactCard.module.css'
import { motion } from 'framer-motion';
import overlayImg from '../../assets/images/overlay2.webp'
import { playClickSound } from '~/utils/playClickSound';

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
                <motion.div layoutId="contact-box" className={`${styles.button}`} onClick={openCard}>
                    <img className={styles['contact-card-overlay']} src={overlayImg} alt="" />
                    Meet your designer
                    <img className={styles.arrow} src={arrowIcon} alt="" />
                </motion.div>
            }

            {isOpen &&
                <motion.div layoutId="contact-box" className={`${styles.card} ${isClosing ? styles.cardClosing : ''}`}>
                    <div className={styles.close} onClick={closeCard}>Close X</div>
                    <img src={dark ? darkBg : lightBg} alt="" />
                    <div className={styles.info}>
                        <div className={styles['info-item']}>
                            <img src={phoneIcon} alt="" />
                            0948 736 606
                        </div>
                        <div className={styles['info-item']}>
                            <img src={emailIcon} alt="" />
                            hoaiynguyen138@gmail.com
                        </div>
                    </div>
                </motion.div>
            }
        </>
    )
}
