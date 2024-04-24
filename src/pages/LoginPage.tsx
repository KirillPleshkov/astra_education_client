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

        if (window.history?.length !== 1) {
          navigate(-1);
        } else {
          navigate("/");
        }
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
      <form className="loginForm" onSubmit={submitHandler}>
        <div className="loginName">Авторизация</div>

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
  );
};

export default LoginPage;
