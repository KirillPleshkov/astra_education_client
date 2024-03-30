import { SortableContext, useSortable } from "@dnd-kit/sortable";
import * as React from "react";
import { CSS } from "@dnd-kit/utilities";
import "./styles.css";
import DisciplineBlockElement from "./DisciplineBlockElement";
import { useMemo } from "react";
import { Mode } from "../UI/Combobox";

interface IDisciplineBlockProps {
  discipline: {
    id: number;
    name: string;
  };
  setDisciplineIdToChangeTitle: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  disciplineIdToChangeTitle: number | undefined;
  setDisciplineIdToCreateElement: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  elements: {
    id: number;
    name: string;
    disciplineId: number;
    dndId: number;
  }[];
  deleteElement: (dndModuleId: number) => void;
  disciplineTitleChange: (changedTitle: string) => void;
  mode: Mode;
}

const DisciplineBlock: React.FunctionComponent<IDisciplineBlockProps> = ({
  discipline,
  setDisciplineIdToChangeTitle,
  disciplineIdToChangeTitle,
  setDisciplineIdToCreateElement,
  elements,
  deleteElement,
  disciplineTitleChange,
  mode,
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

  const modulesId = useMemo(() => elements.map((e) => e.dndId), [elements]);

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
            className="disciplineBlockTitleInput"
            type="text"
            onBlur={() =>
              setTimeout(() => setDisciplineIdToChangeTitle(undefined), 100)
            }
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

      <div className="disciplineBlockModules">
        <SortableContext items={modulesId}>
          {elements.map((element, index) => (
            <DisciplineBlockElement
              element={element}
              key={index}
              deleteElement={deleteElement}
            />
          ))}
        </SortableContext>
      </div>

      <button
        onClick={() => setDisciplineIdToCreateElement(discipline.id)}
        className="disciplineBlockAddModuleButton"
      >
        {mode === Mode.Modules && <>+ Добавить модуль</>}
        {mode === Mode.Skills && <>+ Добавить навык</>}
        {mode === Mode.Products && <>+ Добавить продукт</>}
      </button>
    </div>
  );
};

export default DisciplineBlock;
