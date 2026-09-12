
import Header from "~/components/header";
import type { Route } from "../+types/root";
import { Outlet } from "react-router";
import overlayImg from '../assets/images/overlay.webp'

import "./main.css";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Nguyen Hoai Y - Porfolio" },
        { name: "description", content: "Welcome to my porfolio!" },
    ];
}

export default function Main() {
    return (
        <>
            <div className="layout-main-container">
                <Header />
                <img className='overlay' src={overlayImg} alt="" />
                <Outlet />
            </div>
        </>
    );
}
