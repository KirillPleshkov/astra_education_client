import * as React from "react";
import "./styles.css";
import SearchConstructor from "../../components/SearchConstructor";
import { useCurriculumList } from "../../hooks/UseCurriculumList";
import { useEffect, useMemo, useState } from "react";
import { fetchCurriculumCreate } from "../../api/Curriculum/FetchCurriculumCreate";
import useAxios from "../../services/api";
import CurriculumBlock from "../../components/curriculumConstructor/CurriculumBlock";
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
import { useDisciplineList } from "../../hooks/UseDisciplineList";
import CurriculumBlockDiscipline from "../../components/curriculumConstructor/CurriculumBlockDiscipline";

export type Curriculum = {
  id: number;
  name: string;
  educational_level: {
    id: number;
    name: string;
    study_period: number;
  };
};

export type CurriculumDiscipline = {
  dndId: number;
  id: number;
  name: string;
  curriculumId: number;
  semester: number;
};

const CurriculumConstructor: React.FunctionComponent = () => {
  const { api } = useAxios();

  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);

  const [disciplines, setDisciplines] = useState<CurriculumDiscipline[]>([]);

  const [draggableCurriculum, setDraggableCurriculum] =
    useState<Curriculum | null>(null);

  const [draggableDiscipline, setDraggableDiscipline] =
    useState<CurriculumDiscipline | null>(null);

  const [curriculumIdToChangeTitle, setCurriculumIdToChangeTitle] =
    useState<number>();

  const [
    curriculumDataToCreateDiscipline,
    setCurriculumDataToCreateDiscipline,
  ] = useState<{ curriculumId: number; semester: number }>();

  const curriculumsId = useMemo(
    () => curriculums.map((e) => e.id),
    [curriculums]
  );

  const sensor = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const addCurriculum = (newCurriculum: { name: string; id: number }) => {
    if (curriculums.some((e) => e.id === newCurriculum.id)) return;

    setCurriculums((prev) => {
      return [
        ...prev,
        {
          ...newCurriculum,
          educational_level: {
            id: 1,
            name: "Бакалавриат",
            study_period: 4,
          },
        },
      ];
    });
  };

  const addDiscipline = (newDiscipline: { name: string; id: number }) => {
    if (!curriculumDataToCreateDiscipline) return;

    const { semester, curriculumId } = curriculumDataToCreateDiscipline;

    if (
      disciplines.some(
        (e) =>
          e.id === newDiscipline.id &&
          e.curriculumId === curriculumId &&
          e.semester === semester
      )
    )
      return;

    const discipline: CurriculumDiscipline = {
      ...newDiscipline,
      ...curriculumDataToCreateDiscipline,
      dndId: new Date().getTime(),
    };

    setDisciplines((prev) => {
      return [...prev, discipline];
    });
  };

  const createNewCurriculum = (name: string) => {
    return fetchCurriculumCreate(api, name);
  };

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Curriculum") {
      setDraggableCurriculum(e.active.data.current.curriculum);
    }

    if (e.active.data.current?.type === "Discipline") {
      const elem = e.active.data.current.discipline;

      setDraggableDiscipline(elem);
      // setDraggableElementStartParams({
      //   disciplineId: elem.disciplineId,
      //   pos: elements
      //     .filter((e) => e.disciplineId === elem.disciplineId)
      //     .findIndex((e) => e.id === elem.id),
      // });
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setDraggableCurriculum(null);
    setDraggableDiscipline(null);

    const { active, over } = e;

    if (active.data.current?.type === "Curriculum") {
      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      if (activeId === overId) return;

      setCurriculums((prev) => {
        const activeIndex = prev.findIndex((e) => e.id === activeId);
        const overIndex = prev.findIndex((e) => e.id === overId);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActive = active.data.current?.type === "Discipline";
    const isOver = over.data.current?.type === "Discipline";

    if (!isActive) return;

    if (isActive && isOver) {
      setDisciplines((prev) => {
        const activeIndex = prev.findIndex((e) => e.dndId === activeId);
        const overIndex = prev.findIndex((e) => e.dndId === overId);

        if (
          prev
            .filter(
              (e) =>
                e.curriculumId === prev[overIndex].curriculumId &&
                e.semester === prev[overIndex].semester
            )
            .some(
              (e) =>
                e.id === prev[activeIndex].id &&
                e.dndId !== prev[activeIndex].dndId
            )
        )
          return prev;

        prev[activeIndex].curriculumId = prev[overIndex].curriculumId;
        prev[activeIndex].semester = prev[overIndex].semester;

        return arrayMove(prev, activeIndex, overIndex);
      });
    }

    const isOverASemester = over.data.current?.type === "Semester";

    if (isActive && isOverASemester) {
      setDisciplines((prev) => {
        const activeIndex = prev.findIndex((e) => e.dndId === activeId);

        if (
          prev
            .filter(
              (e) =>
                e.curriculumId === over.data.current?.semester.curriculumId &&
                e.semester === over.data.current?.semester.semester
            )
            .some(
              (e) =>
                e.id === prev[activeIndex].id &&
                e.dndId !== prev[activeIndex].dndId
            )
        )
          return prev;

        prev[activeIndex].curriculumId =
          over.data.current?.semester.curriculumId;
        prev[activeIndex].semester = over.data.current?.semester.semester;

        return arrayMove(prev, activeIndex, activeIndex);
      });
    }
  };

  const curriculumTitleChange = (changedTitle: string) => {
    const newTitleCurriculums = curriculums.map((e) =>
      e.id === curriculumIdToChangeTitle ? { ...e, name: changedTitle } : e
    );
    setCurriculums(newTitleCurriculums);
  };

  const deleteElement = (dndId: number) => {};

  return (
    <div className="moduleContent">
      <div className="pageName">Конструктор учебных планов</div>

      <div className="disciplineAddBlock">
        <div>
          <div style={{ width: "500px" }}>
            {curriculumDataToCreateDiscipline ? (
              <>
                <label className="searchConstructorText-field__label">
                  Введите название дисциплины
                </label>
                <SearchConstructor
                  key={1}
                  blockName="дисциплины"
                  useDataGet={useDisciplineList}
                  setSelectedElement={addDiscipline}
                  width={500}
                  autoFocus={true}
                  createText=""
                  onBlur={() => setCurriculumDataToCreateDiscipline(undefined)}
                />
              </>
            ) : (
              <>
                <label className="searchConstructorText-field__label">
                  Введите название учебного плана
                </label>
                <SearchConstructor
                  key={2}
                  blockName="учебного плана"
                  useDataGet={useCurriculumList}
                  setSelectedElement={addCurriculum}
                  width={500}
                  createNewF={createNewCurriculum}
                  createText="+ Создать новый учебный план с введенным названием"
                />
              </>
            )}
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensor}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <SortableContext items={curriculumsId}>
          {curriculums.map((elem, index) => (
            <CurriculumBlock
              curriculum={elem}
              key={index}
              curriculumIdToChangeTitle={curriculumIdToChangeTitle}
              setCurriculumIdToChangeTitle={setCurriculumIdToChangeTitle}
              curriculumTitleChange={curriculumTitleChange}
              setCurriculumDataToCreateDiscipline={
                setCurriculumDataToCreateDiscipline
              }
              disciplines={disciplines.filter(
                (e) => e.curriculumId === elem.id
              )}
            />
          ))}
        </SortableContext>

        {createPortal(
          <DragOverlay>
            {draggableCurriculum && (
              <CurriculumBlock
                curriculum={draggableCurriculum}
                curriculumIdToChangeTitle={curriculumIdToChangeTitle}
                setCurriculumIdToChangeTitle={setCurriculumIdToChangeTitle}
                curriculumTitleChange={curriculumTitleChange}
                setCurriculumDataToCreateDiscipline={
                  setCurriculumDataToCreateDiscipline
                }
                disciplines={disciplines.filter(
                  (e) => e.curriculumId === draggableCurriculum.id
                )}
              />
            )}

            {draggableDiscipline && (
              <CurriculumBlockDiscipline
                discipline={draggableDiscipline}
                deleteDiscipline={() => undefined}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default CurriculumConstructor;
