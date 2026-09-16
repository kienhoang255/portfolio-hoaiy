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
                <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => playClickSound()}>
                    Home,
                </NavLink>
                <NavLink to="/branding" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => playClickSound()}>
                    Branding,
                </NavLink>
                <NavLink to="/ux-ui" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => playClickSound()}>
                    UX/UI,
                </NavLink>
                <NavLink to="/social" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => playClickSound()}>
                    Social design,
                </NavLink>
                <NavLink to="/video" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => playClickSound()}>
                    Video design,
                </NavLink>
                <NavLink to="/photography" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => playClickSound()}>
                    Photography
                </NavLink>
            </nav>
            {/* <img className='overlay' src={overlayImg} alt="" /> */}
        </header>
    );
}