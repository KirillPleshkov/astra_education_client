import * as React from "react";
import "./style.css";
import { useDebounce } from "use-debounce";
import { useState } from "react";

interface ISearchConstructor {
  blockName: string;
  useDataGet: (name: string) => { name: string; id: number }[] | undefined;
  setSelectedElement: ({ id, name }: { id?: number; name: string }) => void;
}

const SearchConstructor: React.FunctionComponent<ISearchConstructor> = ({
  blockName,
  useDataGet,
  setSelectedElement,
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
          {inputName && !data?.filter((el) => el.name === inputName).length && (
            <li className="searchConstructorDropDownElem">
              <button
                className="searchConstructorDropDownCreate"
                onClick={() => setSelectedElement({ name })}
              >
                + Создать новый модуль с введенным названием
              </button>
            </li>
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
