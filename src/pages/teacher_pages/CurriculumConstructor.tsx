import * as React from "react";
import "./styles.css";
import SearchConstructor from "../../components/SearchConstructor";
import { useCurriculumList } from "../../hooks/UseCurriculumList";
import { RefObject, useMemo, useRef, useState } from "react";
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
import { useTeacherList } from "../../hooks/UseTeacherList";
import { fetchTeacher } from "../../api/User/FetchTeacher";
import { useEducationalLevels } from "../../hooks/UseEducationalLevels";
import {
  fetchCurriculum,
  TypeFetchCurriculum,
} from "../../api/Curriculum/FetchCurriculum";
import { fetchCurriculumDelete } from "../../api/Curriculum/FetchCurriculumDelete";
import { AxiosError } from "axios";
import ModalConfirm from "../../components/modal/ModalConfirm";
import { fetchCurriculumUpdate } from "../../api/Curriculum/FetchCurriculumUpdate";
import InfoMessage from "../../components/UI/InfoMessage";
import { TypeFetchCreated } from "../../api/Module/FetchModuleCreate";

export type Curriculum = {
  id: number;
  name: string;
  educational_level: {
    id: number;
    name: string;
    study_period: number;
  };
};

export type CurriculumDisciplineTeacher = {
  id: number;
  first_name: string;
  last_name: string;
};

export type CurriculumDiscipline = {
  dndId: number;
  id: number;
  name: string;
  curriculumId: number;
  semester: number;
  teachers: CurriculumDisciplineTeacher[];
};

export enum Confirm {
  Delete,
  Remove,
}

const CurriculumConstructor: React.FunctionComponent = () => {
  const { api } = useAxios();

  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);

  const [disciplines, setDisciplines] = useState<CurriculumDiscipline[]>([]);

  const [draggableCurriculum, setDraggableCurriculum] =
    useState<Curriculum | null>(null);

  const [draggableDiscipline, setDraggableDiscipline] =
    useState<CurriculumDiscipline | null>(null);

  const [draggableDisciplineStartParams, setDraggableDisciplineStartParams] =
    useState<{ curriculumId: number; pos: number; semester: number } | null>(
      null
    );

  const [curriculumIdToChangeTitle, setCurriculumIdToChangeTitle] =
    useState<number>();

  const [
    curriculumDataToCreateDiscipline,
    setCurriculumDataToCreateDiscipline,
  ] = useState<{ curriculumId: number; semester: number }>();

  const [curriculumDataToAddTeacher, setCurriculumDataToAddTeacher] = useState<{
    disciplineDndId: number;
  }>();

  const [isCopyDiscipline, setIsCopyDiscipline] = useState<boolean>(false);

  const [curriculumIdToModal, setCurriculumIdToModal] = useState<number>();

  const [modalConfirmMode, setModalConfirmMode] = useState<Confirm>(
    Confirm.Delete
  );

  const [message, setMessage] = useState<{
    text: string;
    success: boolean;
  } | null>(null);

  const [excludedSearchClick, setExcludedSearchClick] = useState<
    RefObject<HTMLElement>[]
  >([]);

  const curriculumsId = useMemo(
    () => curriculums.map((e) => e.id),
    [curriculums]
  );

  const sensor = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const { educationalLevels } = useEducationalLevels();

  const addCurriculum = (newCurriculum: { name: string; id: number }) => {
    if (curriculums.some((e) => e.id === newCurriculum.id)) {
      addMessage("Учебный план с таким названием уже добавлен", false);
      return;
    }

    fetchCurriculum(api, newCurriculum.id).then(({ data }) => {
      const disciplines: CurriculumDiscipline[] = data.disciplines.map(
        (el, index) => {
          return {
            id: el.discipline.id,
            dndId: Math.round(new Date().getTime() * 100 + index),
            name: el.discipline.name,
            curriculumId: data.id,
            semester: el.semester,
            teachers: el.teachers.map((e) => e.user),
          };
        }
      );

      setDisciplines((prev) => {
        return [...prev, ...disciplines];
      });

      setCurriculums((prev) => {
        return [...prev, data];
      });
    });
  };

  const addDiscipline = (newDiscipline: { name: string; id: number }) => {
    if (!curriculumDataToCreateDiscipline) return;

    const { curriculumId } = curriculumDataToCreateDiscipline;

    if (
      disciplines.some(
        (e) => e.id === newDiscipline.id && e.curriculumId === curriculumId
      )
    ) {
      addMessage("Дисциплина с таким названием уже добавлена", false);
      return;
    }

    const discipline: CurriculumDiscipline = {
      ...newDiscipline,
      ...curriculumDataToCreateDiscipline,
      dndId: new Date().getTime(),
      teachers: [],
    };

    setDisciplines((prev) => {
      return [...prev, discipline];
    });
  };

  const addTeacher = (newTeacher: { name: string; id: number }) => {
    if (!curriculumDataToAddTeacher) return;

    if (
      disciplines
        .filter(
          (e) => e.dndId === curriculumDataToAddTeacher.disciplineDndId
        )[0]
        .teachers.some((e) => e.id === newTeacher.id)
    ) {
      addMessage("Данный преподаватель уже связан с данной дисциплиной", false);
      return;
    }

    fetchTeacher(api, newTeacher.id).then(({ data }) => {
      setDisciplines((prev) => {
        return prev.map((e) =>
          e.dndId === curriculumDataToAddTeacher.disciplineDndId
            ? { ...e, teachers: [...e.teachers, data] }
            : e
        );
      });
    });
  };

  const createNewCurriculum = async (name: string) => {
    let result: TypeFetchCreated | undefined;
    await fetchCurriculumCreate(api, name)
      .then(({ data }) => (result = data))
      .then(() => {
        addMessage("Учебный план успешно создан.", true);
      })
      .catch(() => {
        addMessage("Произошла ошибка. Учебный план создать не удалось", false);
      });

    return result;
  };

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Curriculum") {
      setDraggableCurriculum(e.active.data.current.curriculum);
    }

    if (e.active.data.current?.type === "Discipline") {
      const elem = e.active.data.current.discipline;

      setDraggableDiscipline(elem);
      setDraggableDisciplineStartParams({
        semester: elem.semester,
        curriculumId: elem.curriculumId,
        pos: disciplines
          .filter(
            (e) =>
              e.curriculumId === elem.curriculumId &&
              e.semester === elem.semester
          )
          .findIndex((e) => e.id === elem.id),
      });
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
    } else {
      if (
        !isCopyDiscipline ||
        !active.data.current ||
        !draggableDisciplineStartParams
      )
        return;

      if (
        draggableDisciplineStartParams.curriculumId ===
        active.data.current.discipline.curriculumId
      )
        return;

      const discipline: CurriculumDiscipline = {
        id: active.data.current.discipline.id,
        name: active.data.current.discipline.name,
        semester: draggableDisciplineStartParams.semester,
        curriculumId: draggableDisciplineStartParams.curriculumId,
        dndId: new Date().getTime(),
        teachers: active.data.current.discipline.teachers,
      };

      setDisciplines((prev) => {
        const newDisciplineElements = prev.filter(
          (e) =>
            e.curriculumId === draggableDisciplineStartParams.curriculumId &&
            e.semester === draggableDisciplineStartParams.semester
        );

        newDisciplineElements.splice(
          draggableDisciplineStartParams.pos,
          0,
          discipline
        );

        return [
          ...prev.filter(
            (e) =>
              e.curriculumId !== draggableDisciplineStartParams.curriculumId ||
              e.semester !== draggableDisciplineStartParams.semester
          ),
          ...newDisciplineElements,
        ];
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

    const isOverASemester = over.data.current?.type === "Semester";

    if (isActive && isOver) {
      setDisciplines((prev) => {
        const activeIndex = prev.findIndex((e) => e.dndId === activeId);
        const overIndex = prev.findIndex((e) => e.dndId === overId);

        if (
          prev
            .filter((e) => e.curriculumId === prev[overIndex].curriculumId)
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

    if (isActive && isOverASemester) {
      setDisciplines((prev) => {
        const activeIndex = prev.findIndex((e) => e.dndId === activeId);

        if (
          prev
            .filter(
              (e) => e.curriculumId === over.data.current?.semester.curriculumId
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

  const deleteDiscipline = (dndId: number) => {
    setDisciplines((prev) => {
      return prev.filter((e) => e.dndId !== dndId);
    });
  };

  const deleteTeacher = (dndId: number, teacherId: number) => {
    setDisciplines((prev) => {
      return prev.map((e) =>
        e.dndId === dndId
          ? {
              ...e,
              teachers: e.teachers.filter((elem) => elem.id !== teacherId),
            }
          : e
      );
    });
  };

  const setEducationalLevel = (
    curriculumId: number,
    educational_level: Curriculum["educational_level"]
  ) => {
    setCurriculums((prev) => {
      return prev.map((e) =>
        e.id === curriculumId ? { ...e, educational_level } : e
      );
    });

    setDisciplines((prev) => {
      const otherDisciplines = prev.filter(
        (e) =>
          e.curriculumId !== curriculumId ||
          e.semester <= educational_level.study_period * 2
      );

      const updatedDisciplines = prev
        .filter(
          (e) =>
            e.curriculumId === curriculumId &&
            e.semester > educational_level.study_period * 2
        )
        .map((e) => {
          return { ...e, semester: educational_level.study_period * 2 };
        });
      return [...otherDisciplines, ...updatedDisciplines];
    });
  };

  const remove = (id?: number) => {
    const curriculumId = id ? id : curriculumIdToChangeTitle;

    setDisciplines((prev) => {
      return prev.filter((e) => e.curriculumId !== curriculumId);
    });

    setCurriculums((prev) => {
      return prev.filter((e) => e.id !== curriculumId);
    });
  };

  const removeCurriculum = () => {
    if (!curriculumIdToModal) return;

    remove(curriculumIdToModal);

    setCurriculumIdToModal(undefined);
  };

  const deleteCurriculum = () => {
    if (!curriculumIdToModal) return;

    fetchCurriculumDelete(api, curriculumIdToModal)
      .then(() => {
        remove(curriculumIdToModal);
        addMessage("Дисциплина успешно удалена.", true);
      })
      .catch(
        (
          e: AxiosError<{
            detail: {
              linked_students: {
                first_name: string;
                last_name: string;
              }[];
            };
          }>
        ) => {
          const error = e.response?.data?.detail.linked_students;

          if (!error) return;

          // const errorText = error.map((e) => `${e.first_name} ${e.last_name}`);
          addMessage(
            "Вы не можете удалить учебный план, на котором обучаются студенты.",
            false
          );
        }
      );

    setCurriculumIdToModal(undefined);
  };

  const confirmModes = (confirm: Confirm) => {
    if (confirm === Confirm.Delete) {
      return {
        text: "Вы уверены что хотите безвозвратно удалить учебный план?",
        confirmFunc: deleteCurriculum,
      };
    } else {
      return {
        text: "Вы уверены что хотите убрать учебный план? Несохраненные данные пропадут.",
        confirmFunc: removeCurriculum,
      };
    }
  };

  const saveCurriculums = () => {
    const curriculumsToSave: TypeFetchCurriculum[] = curriculums.map(
      (curriculum) => {
        return {
          ...curriculum,
          disciplines: disciplines.map((disc) => {
            return {
              discipline: disc,
              semester: disc.semester,
              teachers: disc.teachers.map((user) => {
                return { user };
              }),
            };
          }),
        };
      }
    );

    addMessage("Изменения успешно сохранены", true);

    curriculumsToSave.map((e) =>
      fetchCurriculumUpdate(api, e).catch((e) => {
        console.error(e);
        addMessage("При сохранении проихошла ошибка", false);
      })
    );
  };

  const addMessage = (text: string, success: boolean) => {
    setMessage({ text, success });
  };

  const clearMessage = () => {
    setMessage(null);
  };

  return (
    <div className="moduleContent">
      <div className="pageName">Конструктор учебных планов</div>

      <div className="disciplineAddBlock">
        <div>
          <div style={{ width: "600px" }}>
            {curriculumDataToCreateDiscipline && (
              <>
                <label className="searchConstructorText-field__label">
                  Введите название дисциплины
                </label>
                <SearchConstructor
                  key={1}
                  blockName="дисциплины"
                  useDataGet={useDisciplineList}
                  setSelectedElement={addDiscipline}
                  width={600}
                  autoFocus={true}
                  createText=""
                  onBlur={() => setCurriculumDataToCreateDiscipline(undefined)}
                />
              </>
            )}

            {curriculumDataToAddTeacher && (
              <>
                <label className="searchConstructorText-field__label">
                  Введите фамилию и имя преподавателя
                </label>
                <SearchConstructor
                  key={3}
                  blockName="преподавателя"
                  useDataGet={useTeacherList}
                  setSelectedElement={addTeacher}
                  width={600}
                  autoFocus={true}
                  createText=""
                  onBlur={() => setCurriculumDataToAddTeacher(undefined)}
                  setExcludedSearchClick={setExcludedSearchClick}
                />
              </>
            )}

            {!(
              curriculumDataToCreateDiscipline || curriculumDataToAddTeacher
            ) && (
              <>
                <label className="searchConstructorText-field__label">
                  Введите название учебного плана
                </label>
                <SearchConstructor
                  key={2}
                  blockName="учебного плана"
                  useDataGet={useCurriculumList}
                  setSelectedElement={addCurriculum}
                  width={600}
                  createNewF={createNewCurriculum}
                  createText="+ Создать новый учебный план с введенным названием"
                />
              </>
            )}
          </div>
        </div>

        <div style={{ marginLeft: "30px" }}>
          <label className="searchConstructorText-field__label">
            Копировать при перетаскивании
          </label>
          <label className="toggler-wrapper style-21">
            <input
              type="checkbox"
              checked={isCopyDiscipline}
              onChange={(e) => setIsCopyDiscipline(e.target.checked)}
            />
            <div className="toggler-slider">
              <div className="toggler-knob"></div>
            </div>
          </label>
        </div>

        {curriculumIdToChangeTitle && (
          <>
            <div style={{ marginLeft: "30px", marginTop: "24px" }}>
              <button
                onClick={() => {
                  setModalConfirmMode(Confirm.Remove);
                  setCurriculumIdToModal(curriculumIdToChangeTitle);
                }}
                className="DisciplineButton"
              >
                Убрать учебный план
              </button>
            </div>

            <div style={{ marginLeft: "30px", marginTop: "24px" }}>
              <button
                onClick={() => {
                  setModalConfirmMode(Confirm.Delete);
                  setCurriculumIdToModal(curriculumIdToChangeTitle);
                }}
                className="DisciplineButton"
              >
                Удалить учебный план
              </button>
            </div>
          </>
        )}

        <div style={{ marginLeft: "30px", marginTop: "24px" }}>
          <button
            onClick={() => saveCurriculums()}
            className="DisciplineButton"
          >
            Сохранить все
          </button>
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
              deleteDiscipline={deleteDiscipline}
              setCurriculumDataToAddTeacher={setCurriculumDataToAddTeacher}
              deleteTeacher={deleteTeacher}
              setEducationalLevel={setEducationalLevel}
              educationalLevels={educationalLevels}
              excludedSearchClick={excludedSearchClick}
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
                deleteDiscipline={deleteDiscipline}
                setCurriculumDataToAddTeacher={setCurriculumDataToAddTeacher}
                deleteTeacher={deleteTeacher}
                setEducationalLevel={setEducationalLevel}
                educationalLevels={educationalLevels}
                excludedSearchClick={excludedSearchClick}
              />
            )}

            {draggableDiscipline && (
              <CurriculumBlockDiscipline
                discipline={draggableDiscipline}
                deleteDiscipline={deleteDiscipline}
                isOverlay={true}
                setCurriculumDataToAddTeacher={setCurriculumDataToAddTeacher}
                deleteTeacher={deleteTeacher}
                excludedSearchClick={excludedSearchClick}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
      <ModalConfirm
        isOpen={curriculumIdToModal !== undefined}
        setIsOpen={setCurriculumIdToModal}
        confirmFunc={confirmModes(modalConfirmMode).confirmFunc}
        text={confirmModes(modalConfirmMode).text}
      />
      {message && <InfoMessage message={message} clear={clearMessage} />}
    </div>
  );
};

export default CurriculumConstructor;
