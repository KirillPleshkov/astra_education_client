import * as React from "react";
import {
  Curriculum,
  CurriculumDiscipline,
} from "../../pages/teacher_pages/CurriculumConstructor";
import "./styles.css";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import CurriculumSemester from "./CurriculumSemester";
import EducationalLevelCombobox from "../UI/EducationalLevelCombobox";

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
  deleteDiscipline: (dndId: number) => void;
  setCurriculumDataToAddTeacher: React.Dispatch<
    React.SetStateAction<
      | {
          disciplineDndId: number;
        }
      | undefined
    >
  >;
  deleteTeacher: (dndId: number, teacherId: number) => void;
  setEducationalLevel: (
    curriculumId: number,
    educational_level: Curriculum["educational_level"]
  ) => void;
  educationalLevels: Curriculum["educational_level"][] | undefined;
}

const CurriculumBlock: React.FunctionComponent<ICurriculumBlockProps> = ({
  curriculum,
  curriculumIdToChangeTitle,
  setCurriculumIdToChangeTitle,
  curriculumTitleChange,
  setCurriculumDataToCreateDiscipline,
  disciplines,
  deleteDiscipline,
  setCurriculumDataToAddTeacher,
  deleteTeacher,
  setEducationalLevel,
  educationalLevels,
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
    disabled: curriculumIdToChangeTitle === curriculum.id,
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
      <div className="blockTitle" {...attributes} {...listeners}>
        <div
          className="blockTitleText"
          onClick={() => setCurriculumIdToChangeTitle(curriculum.id)}
        >
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
        <EducationalLevelCombobox
          value={curriculum.educational_level}
          setValue={setEducationalLevel}
          values={educationalLevels}
          curriculumId={curriculum.id}
        />
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
              deleteDiscipline={deleteDiscipline}
              setCurriculumDataToAddTeacher={setCurriculumDataToAddTeacher}
              deleteTeacher={deleteTeacher}
            />
          )
        )}
      </div>
    </div>
  );
};

export default CurriculumBlock;
