import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { fetchCurriculum } from "../api/Curriculum/FetchCurriculum";
import useAxios from "../services/api";
import { TypeUserContext, userContext } from "../contexts/UserContext";
import "./styles.css";
import { Link } from "react-router-dom";

const CurriculumPage: React.FunctionComponent = () => {
  const { user } = React.useContext<TypeUserContext>(userContext);

  const [semester, setSemester] = React.useState<number>(1);

  const { api } = useAxios();

  const { data } = useQuery({
    queryKey: ["curriculum", user?.curriculum],
    queryFn: () => fetchCurriculum(api, user?.curriculum),
    select: ({ data }) => data,
  });

  if (!data) {
    return <>Loading</>;
  }

  return (
    <div className="mainContent">
      <div className="disciplineName">{data.name}</div>
      <div className="curriculumSemestersList">
        {[...Array(data.educational_level.study_period * 2).keys()].map((e) => (
          <button
            key={e + 1}
            className={
              "curriculumSemesters" +
              (semester === e + 1 ? " curriculumSemestersActive" : "")
            }
            onClick={() => setSemester(e + 1)}
          >
            {e + 1} семестр
          </button>
        ))}
      </div>

      <div className="curriculumDisciplineBlock">
        <div className="curriculumDisciplineTitle">Название</div>
      </div>

      {data.disciplines
        .filter((e) => e.semester === semester)
        .map((e, index) => (
          <div className="curriculumDisciplineBlock" key={index}>
            <Link
              to={{
                pathname: `/discipline/${e.discipline.id}`,
                search: `?curriculum=${data.id}`,
              }}
              className="curriculumDisciplineName"
            >
              {e.discipline.name}
            </Link>
            <div className="curriculumDisciplineTeacherList">
              {e.teachers.map((e, index) => (
                <Link
                  to={`/teacher/${e.user.id}`}
                  className="curriculumDisciplineTeacher"
                  key={index}
                >
                  {e.user.last_name} {e.user.first_name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      <div style={{ height: "40px" }}></div>
    </div>
  );
};

export default CurriculumPage;
