import * as React from "react";
import "./styles.css";
import SearchConstructor from "../../components/SearchConstructor";
import { useDisciplineList } from "../../hooks/UseDisciplineList";
import { useEffect, useState } from "react";
import Combobox from "../../components/UI/Combobox";
import { useModuleList } from "../../hooks/UseModuleList";
import { fetchDisciplineCreate } from "../../api/FetchDisciplineCreate";
import useAxios from "../../services/api";

const DisciplineConstructor: React.FunctionComponent = () => {
  const { api } = useAxios();

  const [addedDiscipline, setAddedDiscipline] = useState<{
    id: number;
    name: string;
  }>();
  const [addedModule, setAddedModule] = useState<{
    id: number;
    name: string;
  }>();

  const [disciplines, setDisciplines] = useState<
    {
      id: number;
      name: string;
      modules: {
        id: number;
        name: string;
      }[];
    }[]
  >([]);

  const [disciplineIdToCreateModule, setDisciplineIdToCreateModule] =
    useState<number>();

  const [disciplineIdToChangeTitle, setDisciplineIdToChangeTitle] =
    useState<number>();

  useEffect(() => {
    if (!addedDiscipline) return;

    if (!disciplines.some((e) => e.id === addedDiscipline.id)) {
      setDisciplines((prev) => {
        return [...prev, { ...addedDiscipline, modules: [] }];
      });
    }

    setAddedDiscipline(undefined);
  }, [addedDiscipline]);

  useEffect(() => {
    if (!addedModule) return;

    const noChangedDisciplines = disciplines.filter(
      (e) => e.id !== disciplineIdToCreateModule
    );
    const changedDiscipline = disciplines.find(
      (e) => e.id === disciplineIdToCreateModule
    );

    if (!changedDiscipline) return;

    const modules = [...changedDiscipline.modules, addedModule];

    setDisciplines([
      ...noChangedDisciplines,
      {
        ...changedDiscipline,
        modules,
      },
    ]);

    setAddedModule(undefined);
  }, [addedModule]);

  useEffect(() => {
    if (!disciplineIdToCreateModule) return;
  }, [disciplineIdToCreateModule]);

  console.log(disciplines);

  const createNewDiscipline = (name: string) => {
    return fetchDisciplineCreate(api, name);
  };

  const onBlurSearch = () => {
    setDisciplineIdToCreateModule(undefined);
  };

  return (
    <div className="moduleContent">
      <div className="pageName">Конструктор дисциплин</div>
      <div className="disciplineAddBlock">
        {disciplineIdToCreateModule ? (
          <div>
            <label className="searchConstructorText-field__label">
              Введите название модуля
            </label>
            <div style={{ width: "500px" }}>
              <SearchConstructor
                blockName="модуля"
                useDataGet={useModuleList}
                setSelectedElement={setAddedModule}
                width={500}
                onBlur={onBlurSearch}
                autoFocus={true}
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="searchConstructorText-field__label">
              Введите название дисциплины
            </label>
            <div style={{ width: "500px" }}>
              <SearchConstructor
                blockName="дисциплины"
                useDataGet={useDisciplineList}
                setSelectedElement={setAddedDiscipline}
                width={500}
                createNewF={createNewDiscipline}
              />
            </div>
          </div>
        )}

        <div style={{ marginLeft: "30px" }}>
          <label className="searchConstructorText-field__label">
            Вверите режим
          </label>
          <Combobox />
        </div>

        {disciplineIdToChangeTitle && (
          <>
            <div style={{ marginLeft: "30px", marginTop: "24px" }}>
              <button>Убрать дисциплину</button>
            </div>

            <div style={{ marginLeft: "30px", marginTop: "24px" }}>
              <button>Удалить дисциплину</button>
            </div>
          </>
        )}

        <div style={{ marginLeft: "30px", marginTop: "24px" }}>
          <button>Сохранить изменения</button>
        </div>
      </div>
      <div className="disciplineBlocks">
        {disciplines.map((elem) => (
          <div className="disciplineBlock" key={elem.id}>
            <div
              className="disciplineBlockTitle"
              onClick={() => setDisciplineIdToChangeTitle(elem.id)}
            >
              {disciplineIdToChangeTitle === elem.id ? (
                <input
                  type="text"
                  onBlur={() => setDisciplineIdToChangeTitle(undefined)}
                  autoFocus
                  value={elem.name}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      setDisciplineIdToChangeTitle(undefined);
                    }
                  }}
                />
              ) : (
                <>{elem.name}</>
              )}
            </div>

            {elem.modules.map((e, index) => (
              <div className="disciplineBlockModule" key={index}>
                {e.name}
              </div>
            ))}

            <button onClick={() => setDisciplineIdToCreateModule(elem.id)}>
              + Добавить модуль
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisciplineConstructor;
