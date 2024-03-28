import { SortableContext, useSortable } from "@dnd-kit/sortable";
import * as React from "react";
import { CSS } from "@dnd-kit/utilities";
import "./styles.css";
import DisciplineBlockModule from "./DisciplineBlockModule";
import { useMemo } from "react";

interface IDisciplineBlockProps {
  discipline: {
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
    dndId: number;
  }[];
  deleteModule: (dndModuleId: number) => void;
  disciplineTitleChange: (changedTitle: string) => void;
}

const DisciplineBlock: React.FunctionComponent<IDisciplineBlockProps> = ({
  discipline,
  setDisciplineIdToChangeTitle,
  disciplineIdToChangeTitle,
  setDisciplineIdToCreateModule,
  modules,
  deleteModule,
  disciplineTitleChange,
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: discipline.id,
    data: {
      type: "Discipline",
      discipline,
    },
    disabled: disciplineIdToChangeTitle === discipline.id,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const modulesId = useMemo(() => modules.map((e) => e.dndId), [modules]);

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
        onClick={() => setDisciplineIdToChangeTitle(discipline.id)}
        {...attributes}
        {...listeners}
      >
        {disciplineIdToChangeTitle === discipline.id ? (
          <input
            type="text"
            onBlur={() => setDisciplineIdToChangeTitle(undefined)}
            autoFocus
            value={discipline.name}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                setDisciplineIdToChangeTitle(undefined);
              }
            }}
            onChange={(e) => disciplineTitleChange(e.target.value)}
          />
        ) : (
          <>{discipline.name}</>
        )}
      </div>

      <SortableContext items={modulesId}>
        {modules.map((e, index) => (
          <DisciplineBlockModule
            module={e}
            key={index}
            deleteModule={deleteModule}
          />
        ))}
      </SortableContext>

      <button onClick={() => setDisciplineIdToCreateModule(discipline.id)}>
        + Добавить модуль
      </button>
    </div>
  );
};

export default DisciplineBlock;
