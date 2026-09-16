
import Header from "~/components/header";
import type { Route } from "../+types/root";
import { Outlet, useLocation } from "react-router";
import overlayImg from '../assets/images/overlay2.webp'

import "./main.css";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Nguyen Hoai Y - Porfolio" },
        { name: "description", content: "Welcome to my porfolio!" },
    ];
}

export default function Main() {
    const { pathname } = useLocation();
    const isHomePage = pathname === "/";

    return (
        <>
            <div className={`layout-main-container${isHomePage ? "" : " without-background"}`}>
                <Header />
                <Outlet />
            </div>
        </>
    );
}
