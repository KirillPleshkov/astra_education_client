import * as React from "react";
import "./styles.css";
import SearchConstructor from "../../components/SearchConstructor";
import { useDisciplineList } from "../../hooks/UseDisciplineList";
import { useEffect, useState } from "react";
import Combobox from "../../components/UI/Combobox";

const DisciplineConstructor: React.FunctionComponent = () => {
  const [addedDiscipline, setAddedDiscipline] = useState<{
    id?: number;
    name: string;
  }>();

  const [disciplines, setDisciplines] = useState<
    {
      id?: number;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    if (!addedDiscipline) return;

    if (!disciplines.some((e) => e.name === addedDiscipline.name)) {
      setDisciplines((prev) => {
        return [...prev, addedDiscipline];
      });
    }
  }, [addedDiscipline]);

  return (
    <div className="moduleContent">
      <div className="pageName">Конструктор дисциплин</div>
      <div className="disciplineAddBlock">
        <div>
          <label className="searchConstructorText-field__label">
            Введите название дисциплины
          </label>
          <div style={{ width: "500px" }}>
            <SearchConstructor
              blockName="дисциплины"
              useDataGet={useDisciplineList}
              setSelectedElement={setAddedDiscipline}
            />
          </div>
        </div>

        <div style={{ marginLeft: "30px" }}>
          <label className="searchConstructorText-field__label">
            Вверите режим
          </label>
          <Combobox />
        </div>
      </div>
      <div className="disciplineBlocks">
        {disciplines.map((elem) => (
          <div className="disciplineBlock" key={elem.id}>
            <div className="disciplineBlockTitle">{elem.name}</div>

            <div className="disciplineBlockModule"></div>

            <button>+ Добавить модуль</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisciplineConstructor;
