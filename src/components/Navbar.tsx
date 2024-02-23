import * as React from "react";
import "./style.css";
import { Link, Outlet } from "react-router-dom";

const Navbar: React.FunctionComponent = () => {
  return (
    <>
      <ul className="nav">
        <li className="navElement">
          <Link to={"/"} className="navElementLink">
            Главня страница
          </Link>
        </li>
        <li className="navElement">
          <a href="#news" className="navElementLink">
            News
          </a>
        </li>
        <li className="navElement">
          <a href="#contact" className="navElementLink">
            Contact
          </a>
        </li>
        <li className="navElement navElementLast">
          <Link to={"/login"} className="navElementLink">
            Войти
          </Link>
        </li>
      </ul>

      <div className="c"></div>

      <main className="content">
        <Outlet />
      </main>

      <div className="footer"></div>
    </>
  );
};

export default Navbar;
