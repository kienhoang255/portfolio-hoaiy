
import Header from "~/components/header";

import bgImg from "../assets/images/main_bg.png"
import type { Route } from "../+types/root";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Nguyen Hoai Y - Porfolio" },
    { name: "description", content: "Welcome to my porfolio!" },
  ];
}

export default function Main() {
  const css = {
    container: {
      width: "100vw",
      height: "100vh",
      backgroundColor: "black"
    },
    bgImg: {
      width: "100vw",
      height: "100vh",
      backgroundColor: "black",
    },
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
      <div style={css.container}>
        <div style={css.bgImg}>
          <Header />
          <img style={css.img} src={bgImg} alt="" />
        </div>
      </div>
    </>
  );
}
