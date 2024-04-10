import { useSortable } from "@dnd-kit/sortable";
import * as React from "react";
import { CurriculumDiscipline } from "../../pages/teacher_pages/CurriculumConstructor";
import CurriculumBlockDiscipline from "./CurriculumBlockDiscipline";

interface ICurriculumSemesterProps {
  semester: number;
  curriculumId: number;
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

const CurriculumSemester: React.FunctionComponent<ICurriculumSemesterProps> = ({
  semester,
  curriculumId,
  setCurriculumDataToCreateDiscipline,
  disciplines,
}) => {
  const { setNodeRef, attributes, listeners } = useSortable({
    id: curriculumId * 10 + semester - 1,
    data: {
      type: "Semester",
      semester: {
        curriculumId,
        semester,
      },
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="blockDiscipline"
      {...attributes}
      {...listeners}
    >
      <div className="blockDisciplineTitle">Семестр {semester}</div>
      <div className="blockDisciplineList">
        {disciplines.map((discipline) => (
          <CurriculumBlockDiscipline
            discipline={discipline}
            deleteDiscipline={() => undefined}
          />
        ))}
      </div>
      <button
        className="blockDisciplineAddButton"
        onClick={() =>
          setCurriculumDataToCreateDiscipline({ curriculumId, semester })
        }
      >
        + Добавить дисциплину
      </button>
    </div>
  );
};

export default CurriculumSemester;
