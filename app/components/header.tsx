import { NavLink } from "react-router";
import "./header.css";
import overlayImg from '../assets/images/overlay2.webp'
import { playClickSound } from "~/utils/playClickSound";

type HeaderProps = {
    theme?: "light" | "dark";
};

export default function Header({ theme = "light" }: HeaderProps) {
    return (
        <header className={`header ${theme}`}>
            <nav className="nav">
                <NavLink to="/" className={({ isActive }) => `nav-link pointer ${isActive ? "active" : ""}`} onClick={() => playClickSound()}>
                    Home,
                </NavLink>
                <NavLink to="/branding" className={({ isActive }) => `nav-link pointer ${isActive ? "active" : ""}`} onClick={() => playClickSound()}>
                    Branding,
                </NavLink>
                <NavLink to="/ux-ui" className={({ isActive }) => `nav-link pointer ${isActive ? "active" : ""}`} onClick={() => playClickSound()}>
                    UX/UI,
                </NavLink>
                <NavLink to="/social" className={({ isActive }) => `nav-link pointer ${isActive ? "active" : ""}`} onClick={() => playClickSound()}>
                    Social design,
                </NavLink>
                <NavLink to="/video" className={({ isActive }) => `nav-link pointer ${isActive ? "active" : ""}`} onClick={() => playClickSound()}>
                    Video design,
                </NavLink>
                <NavLink to="/photography" className={({ isActive }) => `nav-link pointer ${isActive ? "active" : ""}`} onClick={() => playClickSound()}>
                    Photography
                </NavLink>
            </nav>
            {/* <img className='overlay' src={overlayImg} alt="" /> */}
        </header>
    );
}