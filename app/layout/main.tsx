
import Header from "~/components/header";
import type { Route } from "../+types/root";
import { Outlet } from "react-router";
import "./main.css";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Nguyen Hoai Y - Porfolio" },
        { name: "description", content: "Welcome to my porfolio!" },
    ];
}

export default function Main() {
    const css = {
        img: {
            position: "absolute" as const,
            bottom: 0,
            left: 0,
            height: "calc(100vh - 35px)",
            width: "100vw",
        }
    }
    return (
        <>
            <div className="layout-container">
                <div className="layout-wrapper">
                    <Header />
                    <div className="layout-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}
