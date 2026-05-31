import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    // index("routes/main.tsx"),
    layout("./layout/main.tsx", [
        route("", "./page/home/home.tsx"),
        route("branding", "./page/branding/branding.tsx"),
        route("branding/:pid", "./page/branding/branding-project.tsx"),
        route("ux-ui", "./page/uxui.tsx"),
        route("social", "./page/social/social.tsx"),
        route("social/:pid", "./page/social/social-project.tsx"),
        route("video", "./page/video.tsx"),
        route("photography", "./page/photography.tsx"),
    ])
] satisfies RouteConfig;
