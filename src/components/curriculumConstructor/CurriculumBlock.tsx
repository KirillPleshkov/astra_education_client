import * as React from "react";
import {
  Curriculum,
  CurriculumDiscipline,
} from "../../pages/teacher_pages/CurriculumConstructor";
import "./styles.css";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import CurriculumSemester from "./CurriculumSemester";

interface ICurriculumBlockProps {
  curriculum: Curriculum;
  curriculumIdToChangeTitle: number | undefined;
  setCurriculumIdToChangeTitle: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  curriculumTitleChange: (changedTitle: string) => void;
  setCurriculumDataToCreateDiscipline: React.Dispatch<
    React.SetStateAction<
      | {
          curriculumId: number;
          semester: number;
        }
      | undefined
    >
  >;
  disciplines: CurriculumDiscipline[];
}

const CurriculumBlock: React.FunctionComponent<ICurriculumBlockProps> = ({
  curriculum,
  curriculumIdToChangeTitle,
  setCurriculumIdToChangeTitle,
  curriculumTitleChange,
  setCurriculumDataToCreateDiscipline,
  disciplines,
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: curriculum.id,
    data: {
      type: "Curriculum",
      curriculum,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging)
    return (
      <div className="blockDraggable" ref={setNodeRef} style={style}></div>
    );

  return (
    <div className="block" ref={setNodeRef} style={style}>
      <div
        className="blockTitle"
        {...attributes}
        {...listeners}
        onClick={() => setCurriculumIdToChangeTitle(curriculum.id)}
      >
        <div className="blockTitleText">
          {curriculumIdToChangeTitle === curriculum.id ? (
            <input
              className="disciplineBlockTitleInput"
              type="text"
              onBlur={() =>
                setTimeout(() => setCurriculumIdToChangeTitle(undefined), 100)
              }
              autoFocus
              value={curriculum.name}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  setCurriculumIdToChangeTitle(undefined);
                }
              }}
              onChange={(e) => curriculumTitleChange(e.target.value)}
              style={{ marginLeft: "20px" }}
            />
          ) : (
            <>{curriculum.name}</>
          )}
        </div>
      </div>

      <div className="blockDisciplines">
        {[...Array(curriculum.educational_level.study_period * 2).keys()].map(
          (elem, index) => (
            <CurriculumSemester
              semester={elem + 1}
              curriculumId={curriculum.id}
              key={index}
              setCurriculumDataToCreateDiscipline={
                setCurriculumDataToCreateDiscipline
              }
              disciplines={disciplines.filter((e) => e.semester === elem + 1)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default CurriculumBlock;
