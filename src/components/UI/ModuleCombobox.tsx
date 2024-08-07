import * as React from "react";
import "./styles.css";
import { useState } from "react";

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
    <>
      <input
        type="text"
        value={mode}
        className="comboboxInput"
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
          setTimeout(() => setIsFocus(false), 100);
        }}
        style={{ width: 130 }}
        readOnly={true}
      />

      {isFocus && (
        <ul className="comboboxList" style={{ width: 130 }}>
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
    </>
  );
};

export default ModuleCombobox;
