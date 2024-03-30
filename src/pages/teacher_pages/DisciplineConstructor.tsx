import * as React from "react";
import "./styles.css";
import SearchConstructor from "../../components/SearchConstructor";
import { useDisciplineList } from "../../hooks/UseDisciplineList";
import { useMemo, useState } from "react";
import Combobox, { Mode } from "../../components/UI/Combobox";
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
import DisciplineBlockElement from "../../components/disciplineConstructor/DisciplineBlockElement";
import { useProductList } from "../../hooks/UseProductList";
import { useSkillList } from "../../hooks/UseSkillList";

export type Discipline = {
  id: number;
  name: string;
};

export type DisciplineElement = {
  dndId: number;
  id: number;
  name: string;
  disciplineId: number;
};

const DisciplineConstructor: React.FunctionComponent = () => {
  const { api } = useAxios();

  const [mode, setMode] = useState<Mode>(Mode.Modules);

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  const [modules, setModules] = useState<DisciplineElement[]>([]);

  const [skills, setSkills] = useState<DisciplineElement[]>([]);

  const [products, setProducts] = useState<DisciplineElement[]>([]);

  const [draggableDiscipline, setDraggableDiscipline] =
    useState<Discipline | null>(null);

  const [draggableElement, setDraggableElement] =
    useState<DisciplineElement | null>(null);

  const [disciplineIdToCreateElement, setDisciplineIdToCreateElement] =
    useState<number>();

  const [disciplineIdToChangeTitle, setDisciplineIdToChangeTitle] =
    useState<number>();

  const disciplinesId = useMemo(
    () => disciplines.map((e) => e.id),
    [disciplines]
  );

  const addDiscipline = ({ id, name }: { id: number; name: string }) => {
    if (!disciplines.some((e) => e.id === id)) {
      setDisciplines((prev) => {
        return [...prev, { id, name }];
      });
    }
  };

  const addElement = ({ id, name }: { id: number; name: string }) => {
    if (!disciplineIdToCreateElement) return;

    const newElement = {
      id,
      name,
      disciplineId: disciplineIdToCreateElement,
      dndId: new Date().getTime(),
    };

    if (mode === Mode.Modules) setModules((prev) => [...prev, newElement]);

    if (mode === Mode.Skills) setSkills((prev) => [...prev, newElement]);

    if (mode === Mode.Products) setProducts((prev) => [...prev, newElement]);
  };

  const createNewDiscipline = (name: string) => {
    return fetchDisciplineCreate(api, name);
  };

  const onBlurSearch = () => {
    setDisciplineIdToCreateElement(undefined);
  };

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Discipline") {
      setDraggableDiscipline(e.active.data.current?.discipline);
    }

    if (e.active.data.current?.type === "Element") {
      setDraggableElement(e.active.data.current?.element);
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setDraggableDiscipline(null);
    setDraggableElement(null);

    const { active, over } = e;

    if (!over) return;

    if (active.data.current?.type !== "Discipline") return;

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

    const isActiveModule = active.data.current?.type === "Element";
    const isOverModule = over.data.current?.type === "Element";

    if (!isActiveModule) return;

    if (isActiveModule && isOverModule) {
      const swapElements = (prev: DisciplineElement[]) => {
        const activeModuleIndex = prev.findIndex(
          (e) => e.dndId === activeModuleId
        );
        const overModuleIndex = prev.findIndex((e) => e.dndId === overModuleId);

        if (
          prev
            .filter(
              (e) => e.disciplineId === prev[overModuleIndex].disciplineId
            )
            .some(
              (e) =>
                e.id === prev[activeModuleIndex].id &&
                e.dndId !== prev[activeModuleIndex].dndId
            )
        )
          return prev;

        prev[activeModuleIndex].disciplineId =
          prev[overModuleIndex].disciplineId;

        return arrayMove(prev, activeModuleIndex, overModuleIndex);
      };

      if (mode === Mode.Modules) setModules(swapElements);
      if (mode === Mode.Products) setProducts(swapElements);
      if (mode === Mode.Skills) setSkills(swapElements);
    }

    const isOverADiscipline = over.data.current?.type === "Discipline";

    if (isActiveModule && isOverADiscipline) {
      const elementMoveToBlock = (prev: DisciplineElement[]) => {
        const activeModuleIndex = prev.findIndex(
          (e) => e.dndId === activeModuleId
        );

        if (
          prev
            .filter((e) => e.disciplineId === Number(overModuleId))
            .some(
              (e) =>
                e.id === prev[activeModuleIndex].id &&
                e.dndId !== prev[activeModuleIndex].dndId
            )
        )
          return prev;

        prev[activeModuleIndex].disciplineId = Number(overModuleId);

        return arrayMove(prev, activeModuleIndex, activeModuleIndex);
      };

      if (mode === Mode.Modules) setModules(elementMoveToBlock);
      if (mode === Mode.Products) setProducts(elementMoveToBlock);
      if (mode === Mode.Skills) setSkills(elementMoveToBlock);
    }
  };

  const sensor = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const deleteElement = (dndElementId: number) => {
    if (mode === Mode.Modules) {
      setModules((prev) => {
        return prev.filter((e) => e.dndId !== dndElementId);
      });
    }

    if (mode === Mode.Skills) {
      setSkills((prev) => {
        return prev.filter((e) => e.dndId !== dndElementId);
      });
    }

    if (mode === Mode.Products) {
      setProducts((prev) => {
        return prev.filter((e) => e.dndId !== dndElementId);
      });
    }
  };

  const disciplineTitleChange = (changedTitle: string) => {
    const newTitleDisciplines = disciplines.map((e) =>
      e.id === disciplineIdToChangeTitle ? { ...e, name: changedTitle } : e
    );
    setDisciplines(newTitleDisciplines);
  };

  const removeDiscipline = () => {
    setModules((prev) => {
      return prev.filter((e) => e.disciplineId !== disciplineIdToChangeTitle);
    });
    setProducts((prev) => {
      return prev.filter((e) => e.disciplineId !== disciplineIdToChangeTitle);
    });
    setSkills((prev) => {
      return prev.filter((e) => e.disciplineId !== disciplineIdToChangeTitle);
    });

    setDisciplines((prev) => {
      return prev.filter((e) => e.id !== disciplineIdToChangeTitle);
    });
  };

  const elements =
    mode === Mode.Modules ? modules : mode === Mode.Skills ? skills : products;

  console.log(modules);

  return (
    <div className="moduleContent">
      <div className="pageName">Конструктор дисциплин</div>
      <div className="disciplineAddBlock">
        {disciplineIdToCreateElement ? (
          <>
            {mode === Mode.Modules && (
              <div>
                <label className="searchConstructorText-field__label">
                  Введите название модуля
                </label>
                <div style={{ width: "500px" }}>
                  <SearchConstructor
                    key={1}
                    blockName="модуля"
                    useDataGet={useModuleList}
                    setSelectedElement={addElement}
                    width={500}
                    onBlur={onBlurSearch}
                    autoFocus={true}
                    createText=""
                  />
                </div>
              </div>
            )}

            {mode === Mode.Products && (
              <div>
                <label className="searchConstructorText-field__label">
                  Введите название продукта
                </label>
                <div style={{ width: "500px" }}>
                  <SearchConstructor
                    key={1}
                    blockName="продукта"
                    useDataGet={useProductList}
                    setSelectedElement={addElement}
                    width={500}
                    onBlur={onBlurSearch}
                    autoFocus={true}
                    createText=""
                  />
                </div>
              </div>
            )}

            {mode === Mode.Skills && (
              <div>
                <label className="searchConstructorText-field__label">
                  Введите название навыка
                </label>
                <div style={{ width: "500px" }}>
                  <SearchConstructor
                    key={1}
                    blockName="навыка"
                    useDataGet={useSkillList}
                    setSelectedElement={addElement}
                    width={500}
                    onBlur={onBlurSearch}
                    autoFocus={true}
                    createText=""
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div>
            <label className="searchConstructorText-field__label">
              Введите название дисциплины
            </label>
            <div style={{ width: "500px" }}>
              <SearchConstructor
                key={2}
                blockName="дисциплины"
                useDataGet={useDisciplineList}
                setSelectedElement={addDiscipline}
                width={500}
                createNewF={createNewDiscipline}
                createText="+ Создать новую дисциплину с введенным названием"
              />
            </div>
          </div>
        )}

        <div style={{ marginLeft: "30px" }}>
          <label className="searchConstructorText-field__label">
            Вверите режим
          </label>
          <Combobox mode={mode} setMode={setMode} />
        </div>

        {disciplineIdToChangeTitle && (
          <>
            <div style={{ marginLeft: "30px", marginTop: "24px" }}>
              <button onClick={() => removeDiscipline()}>
                Убрать дисциплину
              </button>
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
          <SortableContext items={disciplinesId}>
            {disciplines.map((elem) => (
              <DisciplineBlock
                key={elem.id}
                discipline={elem}
                disciplineIdToChangeTitle={disciplineIdToChangeTitle}
                setDisciplineIdToChangeTitle={setDisciplineIdToChangeTitle}
                setDisciplineIdToCreateElement={setDisciplineIdToCreateElement}
                elements={elements.filter((e) => e.disciplineId === elem.id)}
                deleteElement={deleteElement}
                disciplineTitleChange={disciplineTitleChange}
                mode={mode}
              />
            ))}
          </SortableContext>
        </div>
        {createPortal(
          <DragOverlay>
            {draggableDiscipline && (
              <DisciplineBlock
                discipline={draggableDiscipline}
                disciplineIdToChangeTitle={disciplineIdToChangeTitle}
                setDisciplineIdToChangeTitle={setDisciplineIdToChangeTitle}
                setDisciplineIdToCreateElement={setDisciplineIdToCreateElement}
                elements={elements.filter(
                  (e) => e.disciplineId === draggableDiscipline.id
                )}
                deleteElement={deleteElement}
                disciplineTitleChange={disciplineTitleChange}
                mode={mode}
              />
            )}
            {draggableElement && (
              <DisciplineBlockElement
                element={draggableElement}
                deleteElement={deleteElement}
                isOverlay={true}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default DisciplineConstructor;
