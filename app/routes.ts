import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    // index("routes/main.tsx"),
    layout("./layout/main.tsx", [
        route("", "./page/home.tsx"),
        route("branding", "./page/branding.tsx"),
        route("ux-ui", "./page/uxui.tsx"),
        route("social", "./page/social.tsx"),
        route("video", "./page/video.tsx"),
        route("photography", "./page/photography.tsx"),
    ])
] satisfies RouteConfig;
