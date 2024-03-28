import * as React from "react";
import "./styles.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface IDisciplineBlockModuleProps {
  module: {
    id: number;
    name: string;
    disciplineId: number;
  };
}

const DisciplineBlockModule: React.FunctionComponent<
  IDisciplineBlockModuleProps
> = ({ module }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: module.id,
    data: {
      type: "Module",
      module: module,
    },
    // disabled: disciplineIdToChangeTitle === elem.id,
  });

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
        className="disciplineBlockModule"
      ></div>
    );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="disciplineBlockModule"
    >
      {module.name}
    </div>
  );
};

export default DisciplineBlockModule;
