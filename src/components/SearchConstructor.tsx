import * as React from "react";
import "./style.css";
import useAxios from "../services/api";
import { useDebounce } from "use-debounce";
import { useState } from "react";
import { TypeFetchCreated } from "../api/FetchModuleCreate";
import { Link, useNavigate } from "react-router-dom";
import { AxiosInstance, AxiosResponse } from "axios";

interface ISearchConstructor {
  blockTitle: string;
  blockName: string;
  useDataGet: (name: string) => { name: string; id: number }[] | undefined;
  fetchCreate: (
    api: AxiosInstance,
    name?: string
  ) => Promise<AxiosResponse<TypeFetchCreated, unknown>>;
  navigateUrl: string;
}

const SearchConstructor: React.FunctionComponent<ISearchConstructor> = ({
  blockTitle,
  blockName,
  useDataGet,
  fetchCreate,
  navigateUrl,
}) => {
  const [inputName, setInputName] = useState<string>("");
  const [isFocusInput, setIsFocusInput] = useState<boolean>(false);

  const [name] = useDebounce(inputName, 500);

  const { api } = useAxios();
  const navigator = useNavigate();

  const createHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    fetchCreate(api, name).then(({ data }) => {
      navigator(`${navigateUrl}/${data.id}`);
    });
  };

  const data = useDataGet(name);

  return (
    <div className="searchConstructorBlock">
      <div className="searchConstructorTitle">{blockTitle}</div>
      <div className="searchConstructorText-field">
        <label className="searchConstructorText-field__label">
          Введите название {blockName}
        </label>
        <input
          className="searchConstructorText-field__input"
          type="text"
          name="search"
          id="search"
          placeholder={`Название ${blockName}`}
          value={inputName}
          autoComplete="new-password"
          onChange={(e) => setInputName(e.target.value)}
          onFocus={() => setIsFocusInput(true)}
          onBlur={() => {
            setTimeout(() => setIsFocusInput(false), 100);
          }}
        />

        {isFocusInput && (
          <ul className="searchConstructorDropDownList">
            {inputName &&
              !data?.filter((el) => el.name === inputName).length && (
                <li className="searchConstructorDropDownElem">
                  <button
                    className="searchConstructorDropDownCreate"
                    onClick={createHandler}
                  >
                    + Создать новый модуль с введенным названием
                  </button>
                </li>
              )}
            <div className="searchConstructorOverflow">
              {data &&
                data.map((el) => (
                  <li className="searchConstructorDropDownElem" key={el.id}>
                    <Link
                      to={`${navigateUrl}/${el.id}`}
                      className="searchConstructorDropDownLink"
                    >
                      {el.name}
                    </Link>
                  </li>
                ))}
            </div>
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchConstructor;
