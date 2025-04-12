import * as React from "react";
import "./styles.css";
import { useState } from "react";

export enum Mode {
  Modules = "Модули",
  Skills = "Навыки",
  Products = "Продукты",
  Description = "Описание",
}

interface IComboboxProps {
  setMode: (mode: Mode) => void;
  mode: Mode;
}

const Combobox: React.FunctionComponent<IComboboxProps> = ({
  setMode,
  mode,
}) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);

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
        style={{ width: 180 }}
        readOnly={true}
      />

      {isFocus && (
        <ul className="comboboxList" style={{ width: 180 }}>
          <li className="comboboxDropDownElem">
            <button
              className="comboboxDropDownButton"
              onClick={() => setMode(Mode.Modules)}
            >
              Модули
            </button>
          </li>

          <li className="comboboxDropDownElem">
            <button
              className="comboboxDropDownButton"
              onClick={() => setMode(Mode.Skills)}
            >
              Навыки
            </button>
          </li>

          <li className="comboboxDropDownElem">
            <button
              className="comboboxDropDownButton"
              onClick={() => setMode(Mode.Products)}
            >
              Продукты
            </button>
          </li>

          <li className="comboboxDropDownElem">
            <button
              className="comboboxDropDownButton"
              onClick={() => setMode(Mode.Description)}
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
