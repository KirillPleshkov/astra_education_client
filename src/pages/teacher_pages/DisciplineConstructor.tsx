import * as React from "react";
import "./styles.css";
import SearchConstructor from "../../components/SearchConstructor";
import { useDisciplineList } from "../../hooks/UseDisciplineList";
import { useEffect, useMemo, useState } from "react";
import Combobox from "../../components/UI/Combobox";
import { useModuleList } from "../../hooks/UseModuleList";
import { fetchDisciplineCreate } from "../../api/FetchDisciplineCreate";
import useAxios from "../../services/api";
import DisciplineBlock from "../../components/disciplineConstructor/DisciplineBlock";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import DisciplineBlockModule from "../../components/disciplineConstructor/DisciplineBlockModule";
import { QueryCache } from "@tanstack/react-query";

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
    }[]
  >([]);

  const [disciplineIdToCreateModule, setDisciplineIdToCreateModule] =
    useState<number>();

  const [disciplineIdToChangeTitle, setDisciplineIdToChangeTitle] =
    useState<number>();

  const columnsId = useMemo(() => disciplines.map((e) => e.id), [disciplines]);

  const [draggableDiscipline, setDraggableDiscipline] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [draggableModule, setDraggableModule] = useState<{
    id: number;
    name: string;
    disciplineId: number;
  } | null>(null);

  useEffect(() => {
    if (!addedDiscipline) return;

    if (!disciplines.some((e) => e.id === addedDiscipline.id)) {
      setDisciplines((prev) => {
        return [...prev, { ...addedDiscipline, modules: [] }];
      });
    }

    setAddedDiscipline(undefined);
  }, [addedDiscipline]);

  const [modules, setModules] = useState<
    {
      id: number;
      name: string;
      disciplineId: number;
    }[]
  >([]);

  // useEffect(() => {
  //   if (!addedModule) return;

  //   const noChangedDisciplines = disciplines.filter(
  //     (e) => e.id !== disciplineIdToCreateModule
  //   );
  //   const changedDiscipline = disciplines.find(
  //     (e) => e.id === disciplineIdToCreateModule
  //   );

  //   if (!changedDiscipline) return;

  //   const modules = [...changedDiscipline.modules, addedModule];

  //   setDisciplines([
  //     ...noChangedDisciplines,
  //     {
  //       ...changedDiscipline,
  //       modules,
  //     },
  //   ]);

  //   setAddedModule(undefined);
  // }, [addedModule]);

  useEffect(() => {
    if (!addedModule || !disciplineIdToCreateModule) return;

    setModules((prev) => [
      ...prev,
      { ...addedModule, disciplineId: disciplineIdToCreateModule },
    ]);
  }, [addedModule]);

  const createNewDiscipline = (name: string) => {
    return fetchDisciplineCreate(api, name);
  };

  const onBlurSearch = () => {
    setDisciplineIdToCreateModule(undefined);
  };

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Discipline") {
      setDraggableDiscipline(e.active.data.current?.discipline);
    }

    if (e.active.data.current?.type === "Module") {
      setDraggableModule(e.active.data.current?.module);
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setDraggableDiscipline(null);
    setDraggableModule(null);

    const { active, over } = e;

    if (!over) return;

    const activeDisciplineId = active.id;
    const overDisciplineId = over.id;

    if (activeDisciplineId === overDisciplineId) return;

    setDisciplines((prev) => {
      const activeDisciplineIndex = prev.findIndex(
        (e) => e.id === activeDisciplineId
      );
      const overDisciplineIndex = prev.findIndex(
        (e) => e.id === overDisciplineId
      );

      return arrayMove(prev, activeDisciplineIndex, overDisciplineIndex);
    });
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;

    if (!over) return;

    const activeModuleId = active.id;
    const overModuleId = over.id;

    if (activeModuleId === overModuleId) return;

    const isActiveModule = active.data.current?.type === "Module";
    const isOverModule = over.data.current?.type === "Module";

    if (!isActiveModule) return;

    if (isActiveModule && isOverModule) {
      setModules((prev) => {
        const activeModuleIndex = prev.findIndex(
          (e) => e.id === activeModuleId
        );
        const overModuleIndex = prev.findIndex((e) => e.id === overModuleId);

        prev[activeModuleIndex].disciplineId =
          prev[overModuleIndex].disciplineId;

        return arrayMove(prev, activeModuleIndex, overModuleIndex);
      });
    }

    const isOverADiscipline = over.data.current?.type === "Discipline";

    if (isActiveModule && isOverADiscipline) {
      setModules((prev) => {
        const activeModuleIndex = prev.findIndex(
          (e) => e.id === activeModuleId
        );

        prev[activeModuleIndex].disciplineId = Number(overModuleId);

        return arrayMove(prev, activeModuleIndex, activeModuleIndex);
      });
    }
  };

  const sensor = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

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
          <button>Сохранить все</button>
        </div>
      </div>
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensor}
        onDragOver={onDragOver}
      >
        <div className="disciplineBlocks">
          <SortableContext items={columnsId}>
            {disciplines.map((elem) => (
              <DisciplineBlock
                key={elem.id}
                elem={elem}
                disciplineIdToChangeTitle={disciplineIdToChangeTitle}
                setDisciplineIdToChangeTitle={setDisciplineIdToChangeTitle}
                setDisciplineIdToCreateModule={setDisciplineIdToCreateModule}
                modules={modules.filter((e) => e.disciplineId === elem.id)}
              />
            ))}
          </SortableContext>
        </div>
        {createPortal(
          <DragOverlay>
            {draggableDiscipline && (
              <DisciplineBlock
                elem={draggableDiscipline}
                disciplineIdToChangeTitle={disciplineIdToChangeTitle}
                setDisciplineIdToChangeTitle={setDisciplineIdToChangeTitle}
                setDisciplineIdToCreateModule={setDisciplineIdToCreateModule}
                modules={modules.filter(
                  (e) => e.disciplineId === draggableDiscipline.id
                )}
              />
            )}
            {draggableModule && (
              <DisciplineBlockModule module={draggableModule} />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default DisciplineConstructor;
