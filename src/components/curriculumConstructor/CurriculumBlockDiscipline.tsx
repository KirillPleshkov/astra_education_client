import { useSortable } from "@dnd-kit/sortable";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { CurriculumDiscipline } from "../../pages/teacher_pages/CurriculumConstructor";
import Trash from "../../images/Trash.svg";
import Teacher from "../../images/Teacher.svg";
import { useModal } from "../../hooks/UseModal";

interface ICurriculumBlockDisciplineProps {
  discipline: CurriculumDiscipline;
  deleteDiscipline: (dndId: number) => void;
  isOverlay?: true;
  setCurriculumDataToAddTeacher: React.Dispatch<
    React.SetStateAction<
      | {
          disciplineDndId: number;
        }
      | undefined
    >
  >;
  deleteTeacher: (dndId: number, teacherId: number) => void;
}

const CurriculumBlockDiscipline: React.FunctionComponent<
  ICurriculumBlockDisciplineProps
> = ({
  discipline,
  deleteDiscipline,
  isOverlay,
  setCurriculumDataToAddTeacher,
  deleteTeacher,
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: discipline.dndId,
    data: {
      type: "Discipline",
      discipline,
    },
  });

  const [isHideTrashButton, setIsHideTrashButton] = useState<boolean>(true);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const { isOpen, setIsOpen, modalRef, setButtonRef } = useModal<
    HTMLDivElement,
    HTMLButtonElement
  >();

  useEffect(() => {
    if (buttonRef) {
      setButtonRef(buttonRef);
    }
  }, [buttonRef]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  useEffect(() => {
    setIsHideTrashButton(true);
  }, [discipline, isDragging]);

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="disciplineDragging"
      ></div>
    );

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="discipline"
        onMouseEnter={() => setIsHideTrashButton(false)}
        onMouseLeave={() => setIsHideTrashButton(true)}
        id={`teacherList-${discipline.dndId}`}
      >
        <div className="disciplineText">{discipline.name}</div>
        {!isHideTrashButton && !isOverlay ? (
          <>
            <button
              className="disciplineTrashButton"
              onClick={() => setIsOpen(true)}
              ref={buttonRef}
            >
              <img
                src={Teacher}
                alt="Преподаватели дисциплины"
                className="disciplineTrashIcon"
              />
            </button>
            <button
              className="disciplineTrashButton"
              onClick={() => deleteDiscipline(discipline.dndId)}
            >
              <img
                src={Trash}
                alt="Удалить дисциплину"
                className="disciplineTrashIcon"
              />
            </button>
          </>
        ) : (
          <div style={{ width: "60px" }}></div>
        )}
        {isOpen && (
          <div className="teachersModal" ref={modalRef}>
            <div className="teachersModalTitle">Преподаватели</div>
            <div className="teachersList">
              {discipline.teachers.map((e, index) => (
                <div className="teacherElement">
                  <div
                    key={index}
                    className="teacherName"
                  >{`${e.first_name} ${e.last_name}`}</div>
                  <button
                    className="disciplineTrashButton"
                    onClick={() => deleteTeacher(discipline.dndId, e.id)}
                  >
                    <img
                      src={Trash}
                      alt="Удалить дисциплину"
                      className="disciplineTrashIcon"
                    />
                  </button>
                </div>
              ))}
            </div>

            <button
              className="teachersAddButton"
              onClick={() =>
                setCurriculumDataToAddTeacher({
                  disciplineDndId: discipline.dndId,
                })
              }
            >
              Добавить преподавателя
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CurriculumBlockDiscipline;
