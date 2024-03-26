import * as React from "react";
import "./styles.css";
import { useState } from "react";

interface IComboboxProps {}

const Combobox: React.FunctionComponent<IComboboxProps> = (props) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("Модули");

  return (
    <>
      <input
        type="text"
        value={mode}
        className="comboboxInput"
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
          setTimeout(() => setIsFocus(false), 100);
        }}
      />

      {isFocus && (
        <ul className="comboboxList">
          <li className="comboboxDropDownElem">
            <button
              className="comboboxDropDownButton"
              onClick={() => setMode("Модули")}
            >
              Модули
            </button>
          </li>

          <li className="comboboxDropDownElem">
            <button
              className="comboboxDropDownButton"
              onClick={() => setMode("Навыки")}
            >
              Навыки
            </button>
          </li>

          <li className="comboboxDropDownElem">
            <button
              className="comboboxDropDownButton"
              onClick={() => setMode("Продукты группы Астра")}
            >
              Продукты груммы Астра
            </button>
          </li>

          <li className="comboboxDropDownElem">
            <button
              className="comboboxDropDownButton"
              onClick={() => setMode("Описание")}
            >
              Описание
            </button>
          </li>
        </ul>
      )}
    </>
  );
};

export default Combobox;
