
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

  return (
    <>

    </>
  );
}
