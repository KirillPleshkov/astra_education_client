import * as React from "react";
import "./style.css";
import { Link } from "react-router-dom";

type ModuleType = {
  disciplineId: number;
  moduleId?: number;
  curriculumId: number;
  modules: {
    pk: number;
    name: string;
  }[];
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

      {modules.map((elem) => (
        <li
          key={elem.pk}
          className={
            elem.pk === moduleId
              ? "layoutElement layoutElementSelected"
              : "layoutElement"
          }
        >
          {/* // <li className="layoutElement"> */}
          <Link
            to={`/discipline/${curriculumId}/${disciplineId}/${elem.pk}`}
            className="layoutElementLink"
          >
            {elem.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default DisciplineLayout;
