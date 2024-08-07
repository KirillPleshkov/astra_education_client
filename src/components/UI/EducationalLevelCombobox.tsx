import * as React from "react";
import { Curriculum } from "../../pages/teacher_pages/CurriculumConstructor";
import { useState } from "react";

interface IEducationalLevelComboboxProps {
  values: Curriculum["educational_level"][] | undefined;
  value: Curriculum["educational_level"];
  setValue: (
    curriculumId: number,
    educational_level: Curriculum["educational_level"]
  ) => void;
  curriculumId: number;
}

const EducationalLevelCombobox: React.FunctionComponent<
  IEducationalLevelComboboxProps
> = ({ values, value, setValue, curriculumId }) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);

  return (
    <div>
      <input
        type="text"
        value={value.name}
        className="comboboxInput"
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
          setTimeout(() => setIsFocus(false), 100);
        }}
        style={{ width: 160 }}
        readOnly={true}
      />
      {isFocus && (
        <ul className="comboboxList" style={{ width: 160 }}>
          {values &&
            values.map((e, index) => (
              <li className="comboboxDropDownElem" key={index}>
                <button
                  className="comboboxDropDownButton"
                  onClick={() => setValue(curriculumId, e)}
                >
                  {e.name}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default EducationalLevelCombobox;
