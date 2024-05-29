import * as React from "react";
import { useContext, useMemo } from "react";
import { userContext } from "../contexts/UserContext";
import useAxios from "../services/api";
import { useQuery } from "@tanstack/react-query";
import { fetchCurriculumsTeacher } from "../api/Curriculum/FetchCurriculumsTeacher";
import { Link } from "react-router-dom";
import Download from "../images/Download.svg";

const TeacherDisciplinePage: React.FunctionComponent = () => {
  const { user } = useContext(userContext);

  const { api } = useAxios();

  const { data } = useQuery({
    queryKey: ["teacher_curriculum", user],
    queryFn: () => fetchCurriculumsTeacher(api),
    select: ({ data }) => data,
  });

  console.log(data);

  const curriculumIds = useMemo(
    () => [...new Set(data?.map((e) => e.curriculum.id))],
    [data]
  );

  return (
    <div className="mainContent">
      <div className="disciplineName">Мои дисциплины</div>
      <div>
        {curriculumIds.map((curriculumId, index) => (
          <>
            <div style={{ display: "flex" }}>
              <h2 className="teacherDisciplineCurriculumName" key={index}>
                {
                  data?.filter((e) => e.curriculum.id === curriculumId)[0]
                    .curriculum.name
                }
              </h2>
              <a
                href={`http://127.0.0.1:8000/curriculum/pdf_download/${curriculumId}/`}
                download
                style={{ display: "flex" }}
              >
                <img
                  src={Download}
                  alt="Скачать"
                  className="disciplineBlockModuleTrashIcon"
                />
              </a>
            </div>

            {data
              ?.filter((e) => e.curriculum.id === curriculumId)
              .map((e, index) => (
                <div className="curriculumDisciplineBlock" key={index}>
                  <div style={{ display: "flex", minHeight: "1px" }}>
                    <Link
                      to={{
                        pathname: `/discipline/${e.discipline.id}`,
                        search: `?curriculum=${e.curriculum.id}`,
                      }}
                      className="curriculumDisciplineName"
                    >
                      {e.discipline.name}. Семестр {e.semester}.
                    </Link>
                    <a
                      href={`http://127.0.0.1:8000/discipline/pdf_download/${e.discipline.id}/`}
                      download
                      style={{ display: "flex", marginLeft: "15px" }}
                    >
                      <img
                        src={Download}
                        alt="Скачать"
                        className="disciplineBlockModuleTrashIcon"
                      />
                    </a>
                  </div>

                  <div style={{ display: "flex", marginTop: "30px" }}>
                    {e.users.map((user, index) => (
                      <Link
                        to={`/teacher/${user.id}`}
                        className="curriculumDisciplineTeacher"
                        key={index}
                      >
                        {user.last_name} {user.first_name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </>
        ))}
        <div style={{ height: "30px" }}></div>
      </div>
    </div>
  );
};

export default TeacherDisciplinePage;
