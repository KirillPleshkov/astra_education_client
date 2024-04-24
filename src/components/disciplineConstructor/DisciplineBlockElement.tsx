import * as React from "react";
import "./styles.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Trash from "../../images/Trash.svg";
import { useEffect, useState } from "react";
import { DisciplineElement } from "../../pages/teacher_pages/DisciplineConstructor";

interface IDisciplineBlockElementProps {
  element: DisciplineElement;
  deleteElement: (dndModuleId: number) => void;
  isOverlay?: true;
}

const DisciplineBlockElement: React.FunctionComponent<
  IDisciplineBlockElementProps
> = ({ element, deleteElement, isOverlay }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.dndId,
    data: {
      type: "Element",
      element,
    },
  });

  const [isHideTrashButton, setIsHideTrashButton] = useState<boolean>(true);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  useEffect(() => {
    setIsHideTrashButton(true);
  }, [element, isDragging]);

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="disciplineBlockModuleDragging"
      ></div>
    );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="disciplineBlockModule"
      onMouseEnter={() => setIsHideTrashButton(false)}
      onMouseLeave={() => setTimeout(() => setIsHideTrashButton(true), 30)}
    >
      <div className="disciplineBlockModuleText">{element.name}</div>
      {!isHideTrashButton && !isOverlay ? (
        <button
          className="disciplineBlockModuleTrashButton"
          onClick={() => deleteElement(element.dndId)}
        >
          <img
            src={Trash}
            alt="Удалить элемент"
            className="disciplineBlockModuleTrashIcon"
          />
        </button>
      ) : (
        <div style={{ width: "30px" }}></div>
      )}
    </div>
  );
};

export default DisciplineBlockElement;
