import { SortableContext, useSortable } from "@dnd-kit/sortable";
import * as React from "react";
import { CSS } from "@dnd-kit/utilities";
import "./styles.css";
import DisciplineBlockModule from "./DisciplineBlockModule";
import { useMemo } from "react";

interface IDisciplineBlockProps {
  elem: {
    id: number;
    name: string;
  };
  setDisciplineIdToChangeTitle: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  disciplineIdToChangeTitle: number | undefined;
  setDisciplineIdToCreateModule: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  modules: {
    id: number;
    name: string;
    disciplineId: number;
  }[];
}

const DisciplineBlock: React.FunctionComponent<IDisciplineBlockProps> = ({
  elem,
  setDisciplineIdToChangeTitle,
  disciplineIdToChangeTitle,
  setDisciplineIdToCreateModule,
  modules,
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: elem.id,
    data: {
      type: "Discipline",
      discipline: elem,
    },
    disabled: disciplineIdToChangeTitle === elem.id,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const modulesId = useMemo(() => modules.map((e) => e.id), [modules]);

  if (isDragging)
    return (
      <div
        className="disciplineBlockDragging"
        ref={setNodeRef}
        style={style}
      ></div>
    );

  return (
    <div className="disciplineBlock" ref={setNodeRef} style={style}>
      <div
        className="disciplineBlockTitle"
        onClick={() => setDisciplineIdToChangeTitle(elem.id)}
        {...attributes}
        {...listeners}
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

      <SortableContext items={modulesId}>
        {modules.map((e, index) => (
          <DisciplineBlockModule module={e} key={index} />
        ))}
      </SortableContext>

      <button onClick={() => setDisciplineIdToCreateModule(elem.id)}>
        + Добавить модуль
      </button>
    </div>
  );
};

export default DisciplineBlock;
