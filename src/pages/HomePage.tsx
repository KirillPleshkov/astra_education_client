import * as React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../contexts/UserContext";

const HomePage: React.FunctionComponent = () => {
  const { user } = useContext(userContext);

  return (
    <div className="mainContent">
      <div className="disciplineName">Главная страница</div>
      <div className="homeCards">
        <div className="homeCard">
          <h3 className="h">Учебный процесс</h3>
          <Link to={"/curriculum"} className="homeCardLink">
            Дисциплины
          </Link>
          <Link to={"/me"} className="homeCardLink">
            Мой профиль
          </Link>
        </div>
        <div className="homeCard">
          <h3 className="h">Возможности преподавателя</h3>
          <Link to={"/teacher_disciplines"} className="homeCardLink">
            Мои дисциплины
          </Link>
          <Link to={"/module_constructor"} className="homeCardLink">
            Конструктор модулей
          </Link>
          <Link to={"/discipline_constructor"} className="homeCardLink">
            Конструктор дисциплин
          </Link>
          <Link to={"/curriculum_constructor"} className="homeCardLink">
            Конструктор учебных планов
          </Link>
        </div>

        <div className="homeCard">
          <h3 className="h">Справка</h3>
          <Link to={"/"} className="homeCardLink">
            Помощь
          </Link>
          <Link to={"/"} className="homeCardLink">
            Поддержка
          </Link>
          <Link to={"/"} className="homeCardLink">
            Инструкция
          </Link>
        </div>

        <div className="homeCard">
          <h3 className="h">Новости</h3>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
