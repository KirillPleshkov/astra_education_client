import * as React from "react";
import "./styles.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Trash from "../../images/Trash.svg";
import { useState } from "react";

interface IDisciplineBlockModuleProps {
  module: {
    id: number;
    name: string;
    disciplineId: number;
    dndId: number;
  };
  deleteModule: (dndModuleId: number) => void;
}

const DisciplineBlockModule: React.FunctionComponent<
  IDisciplineBlockModuleProps
> = ({ module, deleteModule }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: module.dndId,
    data: {
      type: "Module",
      module: module,
    },
  });

  const [isHideTrashButton, setIsHideTrashButton] = useState<boolean>(true);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

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
      onMouseLeave={() => setIsHideTrashButton(true)}
    >
      <div className="disciplineBlockModuleText">{module.name}</div>
      {!isHideTrashButton && (
        <button
          className="disciplineBlockModuleTrashButton"
          onClick={() => deleteModule(module.dndId)}
        >
          <img
            src={Trash}
            alt="Удалить модуль"
            className="disciplineBlockModuleTrashIcon"
          />
        </button>
      )}
    </div>
  );
};

export default DisciplineBlockModule;
