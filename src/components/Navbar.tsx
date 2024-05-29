import * as React from "react";
import "./style.css";
import { Link, Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { TypeUserContext, userContext } from "../contexts/UserContext";
import ModalTeacherMenu from "./modal/ModalTeacherMenu";

const Navbar: React.FunctionComponent = () => {
  const { user } = useContext<TypeUserContext>(userContext);

  const [isTeacherMenuOpen, setIsTeacherMenuOpen] = useState<boolean>(false);

  return (
    <>
      <ul className="nav">
        <li className="navElement">
          <Link to={"/"} className="navElementLink">
            Astra Education
          </Link>
        </li>
        <li className="navElement">
          <Link to={"/curriculum"} className="navElementLink">
            Учебный план
          </Link>
        </li>

        {user?.role[1] === "TEACHER" && (
          <li className="navElement">
            <div
              className="navElementLink noselect"
              onClick={() => setIsTeacherMenuOpen(true)}
            >
              Меню преподавателя
            </div>
          </li>
        )}

        {user ? (
          <>
            <li className="navElement navElementLast">
              <Link className="navElementLink" to={"/me"}>
                {user.email}
              </Link>
            </li>
            <li className="navElement navElementLast">
              <div className="navElementText">{user.role[0]}</div>
            </li>
          </>
        ) : (
          <li className="navElement navElementLast">
            <Link to={"/login"} className="navElementLink">
              Войти
            </Link>
          </li>
        )}
      </ul>

      {user && (
        <ModalTeacherMenu
          isOpen={isTeacherMenuOpen}
          setIsOpen={setIsTeacherMenuOpen}
          linguist_roles={user?.linguist_roles}
        />
      )}

      <div className="c"></div>

      <main className="content">
        <Outlet />
      </main>

      <div className="footer"></div>
    </>
  );
};

export default Navbar;
