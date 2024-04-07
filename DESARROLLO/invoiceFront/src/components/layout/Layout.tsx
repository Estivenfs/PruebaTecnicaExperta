import { Outlet } from "react-router-dom";
import { Nav } from "./Nav";

export const Layout = () => {
  return (
    <>
      {/* Layout */}
      <Nav/>
      {/* Contenido Principal */}
      <section className="layout__content">
        {<Outlet />}
      </section>
    </>
  );
}
