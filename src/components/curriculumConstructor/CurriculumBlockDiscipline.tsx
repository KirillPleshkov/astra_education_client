import { useSortable } from "@dnd-kit/sortable";
import * as React from "react";
import { useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { CurriculumDiscipline } from "../../pages/teacher_pages/CurriculumConstructor";
import Trash from "../../images/Trash.svg";

interface ICurriculumBlockDisciplineProps {
  discipline: CurriculumDiscipline;
  deleteDiscipline: (dndId: number) => void;
  isOverlay?: true;
}

const CurriculumBlockDiscipline: React.FunctionComponent<
  ICurriculumBlockDisciplineProps
> = ({ discipline, deleteDiscipline, isOverlay }) => {
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="discipline"
      onMouseEnter={() => setIsHideTrashButton(false)}
      onMouseLeave={() => setIsHideTrashButton(true)}
    >
      <div className="disciplineText">{discipline.name}</div>
      {!isHideTrashButton && !isOverlay && (
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
      )}
    </div>
  );
};

export default CurriculumBlockDiscipline;
