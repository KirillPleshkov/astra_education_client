import * as React from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { TypeFetchDiscipline } from "../api/Discipline/FetchDiscipline";

type ModuleType = {
  disciplineId: number;
  moduleId?: number;
  curriculumId: number;
  modules: TypeFetchDiscipline["modules"];
};

const DisciplineLayout: React.FunctionComponent<ModuleType> = ({
  modules,
  disciplineId,
  curriculumId,
  moduleId,
}) => {
  return (
    <ul className="layout">
      <li
        className={
          moduleId ? "layoutElement" : "layoutElement layoutElementSelected"
        }
      >
        <Link
          to={`/discipline/${curriculumId}/${disciplineId}`}
          className="layoutElementLink"
        >
          Описание
        </Link>
      </li>

      {modules
        .sort((a, b) => a.position - b.position)
        .map((elem) => (
          <li
            key={elem.module.id}
            className={
              elem.module.id === moduleId
                ? "layoutElement layoutElementSelected"
                : "layoutElement"
            }
          >
            <Link
              to={`/discipline/${curriculumId}/${disciplineId}/${elem.module.id}`}
              className="layoutElementLink"
            >
              {elem.module.name}
            </Link>
          </li>
        ))}
    </ul>
  );
};

export default DisciplineLayout;
