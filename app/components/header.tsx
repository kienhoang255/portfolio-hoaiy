import { NavLink } from "react-router";
import "./header.css";

export default function Header() {
    return (
        <header className="header">
            <nav className="nav">
                <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Home
                </NavLink>
                <NavLink to="/branding" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Branding
                </NavLink>
                <NavLink to="/ux-ui" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    UX/UI
                </NavLink>
                <NavLink to="/social" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Social design
                </NavLink>
                <NavLink to="/video" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Video design
                </NavLink>
                <NavLink to="/photography" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Photography
                </NavLink>
            </nav>
        </header>
    );
}