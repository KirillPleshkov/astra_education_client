import * as React from "react";
import "./styles.css";
import { useContext, useRef, useState } from "react";
import { fetchToken } from "../api/Token/FetchToken";
import { useNavigate } from "react-router-dom";
import { TypeUserContext, userContext } from "../contexts/UserContext";

const LoginPage: React.FunctionComponent = () => {
  const inputRefEmail = useRef<HTMLInputElement>(null);
  const inputRefPassword = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string>("");

  const { updateUserInfo } = useContext<TypeUserContext>(userContext);

  const navigate = useNavigate();

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    fetchToken({
      email: inputRefEmail.current?.value,
      password: inputRefPassword.current?.value,
    })
      .then(({ data }) => {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        updateUserInfo();

        navigate("/");
      })
      .catch(() => {
        setError("Неверный логин или пароль");
      });
  };

  const clearErrorHandler = () => {
    setError("");
  };

  return (
    <div className="loginContent">
      <div className="loginModal">
        <div className="leftSide">
          <div className="leftSide--title">Astra Linux</div>
          <div className="leftSide--cont">
            <div className="leftSide--cont-reg">Регистрация</div>
            <div className="leftSide--cont-text">
              Для создания аккаунта необходимо пройти процедуру регистрации
            </div>
          </div>
          <button className="leftSide--button">Зарегистрироваться</button>
        </div>

        <form className="loginForm" onSubmit={submitHandler}>
          <div className="loginName">Авторизация</div>

          <div className="loginForm-text">
            Для входа необходимо ввести логин и пароль
          </div>

          <div className="text-field text-field_floating-3">
            <input
              className="text-field__input"
              type="email"
              id="email"
              name="email"
              placeholder="alexander@itchief.ru"
              ref={inputRefEmail}
              onChange={clearErrorHandler}
              autoComplete="email"
            />
            <label className="text-field__label" htmlFor="email">
              Логин
            </label>
          </div>

          <div className="text-field text-field_floating-3">
            <input
              className="text-field__input"
              type="password"
              id="password"
              name="password"
              placeholder="alexander@itchief.ru"
              ref={inputRefPassword}
              onChange={clearErrorHandler}
              autoComplete="password"
            />
            <label className="text-field__label" htmlFor="email">
              Пароль
            </label>
          </div>

          <div className="loginError">{error}</div>

          <button type="submit" className="loginSubmitButton">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
