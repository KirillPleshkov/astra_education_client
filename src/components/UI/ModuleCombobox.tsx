import * as React from "react";
import "./styles.css";
import { useState } from "react";

import DropDownArr from "../../images/DropDownArr.svg";

export enum ModuleMode {
  Text = "Текст",
  Files = "Файлы",
}

interface IComboboxProps {
  setMode: (mode: ModuleMode) => void;
  mode: ModuleMode;
}

const ModuleCombobox: React.FunctionComponent<IComboboxProps> = ({
  setMode,
  mode,
}) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);

  return (
    <div style={{ position: "relative" }}>
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
      <div className="arrowCont">
        <img src={DropDownArr} />
      </div>

      {isFocus && (
        <ul className="comboboxList" style={{ width: 180 }}>
          <li className="comboboxDropDownElem">
            <button
              className="comboboxDropDownButton"
              onClick={() => setMode(ModuleMode.Text)}
            >
              Текст
            </button>
          </li>

          <li className="comboboxDropDownElem">
            <button
              className="comboboxDropDownButton"
              onClick={() => setMode(ModuleMode.Files)}
            >
              Файлы
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ModuleCombobox;
