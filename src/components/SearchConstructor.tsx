import * as React from "react";
import "./style.css";
import { useDebounce } from "use-debounce";
import { useState } from "react";
import { AxiosResponse } from "axios";
import { TypeFetchCreated } from "../api/FetchModuleCreate";

interface ISearchConstructor {
  blockName: string;
  useDataGet: (name: string) => { name: string; id: number }[] | undefined;
  setSelectedElement: ({ id, name }: { id: number; name: string }) => void;
  width?: number;
  createNewF?: (
    name: string
  ) => Promise<AxiosResponse<TypeFetchCreated, unknown>>;
  onBlur?: () => void;
  autoFocus?: boolean;
}

const SearchConstructor: React.FunctionComponent<ISearchConstructor> = ({
  blockName,
  useDataGet,
  setSelectedElement,
  width,
  createNewF,
  onBlur,
  autoFocus,
}) => {
  const [inputName, setInputName] = useState<string>("");
  const [isFocusInput, setIsFocusInput] = useState<boolean>(false);

  const [name] = useDebounce(inputName, 500);

  const data = useDataGet(name);

  return (
    <>
      <input
        className="searchConstructorText-field__input"
        type="text"
        name="search"
        id="search"
        autoFocus={autoFocus}
        placeholder={`Название ${blockName}`}
        value={inputName}
        autoComplete="new-password"
        onChange={(e) => setInputName(e.target.value)}
        onFocus={() => setIsFocusInput(true)}
        onBlur={() => {
          setTimeout(() => {
            setIsFocusInput(false);
            onBlur && onBlur();
          }, 100);
        }}
        style={{ width }}
      />

      {isFocusInput && (
        <ul className="searchConstructorDropDownList" style={{ width }}>
          {inputName && !data?.filter((el) => el.name === inputName).length && (
            <>
              {createNewF && (
                <li className="searchConstructorDropDownElem">
                  <button
                    className="searchConstructorDropDownCreate"
                    onClick={() => {
                      createNewF(name).then(({ data }) => {
                        setSelectedElement(data);
                      });
                    }}
                  >
                    + Создать новый модуль с введенным названием
                  </button>
                </li>
              )}
            </>
          )}
          <div className="searchConstructorOverflow">
            {data &&
              data.map((el) => (
                <li className="searchConstructorDropDownElem" key={el.id}>
                  <button
                    className="searchConstructorDropDownCreate"
                    onClick={() => setSelectedElement(el)}
                  >
                    {el.name}
                  </button>
                </li>
              ))}
          </div>
        </ul>
      )}
    </>
  );
};

export default SearchConstructor;
