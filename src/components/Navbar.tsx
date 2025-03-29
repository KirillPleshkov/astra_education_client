import * as React from "react";
import "./style.css";
import { Link, Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { userContext } from "../contexts/UserContext";
import ModalTeacherMenu from "./modal/ModalTeacherMenu";
import { useNavigate } from "react-router-dom";

const Navbar: React.FunctionComponent = () => {
  const { user, logout } = useContext(userContext);

  const navigate = useNavigate();

  const [isTeacherMenuOpen, setIsTeacherMenuOpen] = useState<boolean>(false);

  return (
    <>
      <ul className="nav">
        <li className="navElement">
          <Link to={"/"} className="navElementLink">
            Astra Linux
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
          <li className="navElement navElementLast">
            <button
              className="navElementLink logoutBtn"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Выйти
            </button>
          </li>
        ) : (
          <li className="navElement navElementLast">
            <Link to={"/login"} className="navElementLink loginBtn">
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

      <main className="content">
        <Outlet />
      </main>
    </>
  );
};

export default Navbar;
