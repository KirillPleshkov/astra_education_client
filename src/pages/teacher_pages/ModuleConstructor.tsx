import * as React from "react";
import "./styles.css";
import { useRef, useState } from "react";
import { fetchModuleCreate } from "../../api/FetchModuleCreate";
import useAxios from "../../services/api";
import { Axios, AxiosError } from "axios";

const ModuleConstructor: React.FunctionComponent = () => {
  const inputRefName = useRef<HTMLInputElement>(null);

  const { api } = useAxios();

  const [createError, setCreateError] = useState<string>("");

  const submitCreateHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (inputRefName.current?.value === "") {
      setCreateError("Название модуля не должно быть пустым");
      return;
    }

    fetchModuleCreate(api, inputRefName.current?.value)
      .then(() => {})
      .catch(() => {
        setCreateError("Модуль с таким названием уже существует");
      });
  };

  return (
    <div className="moduleContent">
      <div className="pageName">Конструирование Модулей</div>

      <div className="moduleBlocks">
        <div className="moduleBlock">
          <form onSubmit={submitCreateHandler}>
            <div className="moduleCreateTitle">Создание модуля</div>
            <div className="moduleText-field">
              <label className="moduleText-field__label">
                Введите название модуля
              </label>
              <input
                onChange={() => setCreateError("")}
                ref={inputRefName}
                className="moduleText-field__input"
                type="text"
                name="create"
                id="create"
                placeholder="Название модуля"
              />
            </div>
            <div className="moduleErrorText">{createError}</div>
            <button type="submit" className="moduleCreateSubmitButton">
              Создать
            </button>
          </form>
        </div>
        <div className="moduleBlock">
          <div className="moduleCreateTitle">Поиск модулей</div>
          <div className="moduleText-field">
            <label className="moduleText-field__label">
              Введите название модуля
            </label>
            <input
              onChange={() => setCreateError("")}
              ref={inputRefName}
              className="moduleText-field__input"
              type="text"
              name="search"
              id="search"
              placeholder="Название модуля"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleConstructor;
