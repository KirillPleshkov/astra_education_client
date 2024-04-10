import * as React from "react";
import { useParams } from "react-router-dom";
import "./styles.css";
import DisciplineLayout from "../components/DisciplineLayout";
import { fetchDiscipline } from "../api/Discipline/FetchDiscipline";
import { useQuery } from "@tanstack/react-query";
import Module from "../components/module/Module";
import useAxios from "../services/api";

const DisciplinePage: React.FunctionComponent = () => {
  const { curriculumId, disciplineId, moduleId } = useParams();

  const { api } = useAxios();

  const { data } = useQuery({
    queryKey: ["discipline", disciplineId],
    queryFn: () => fetchDiscipline(api, disciplineId),
    select: ({ data }) => data,
  });

  if (!data) {
    return <>Loading</>;
  }

  return (
    <>
      <div className="disciplineName">{data.name}</div>
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <DisciplineLayout
          modules={data.modules}
          disciplineId={Number(disciplineId)}
          curriculumId={Number(curriculumId)}
          moduleId={Number(moduleId)}
        />
        <Module />
      </div>
    </>
  );
};

export default DisciplinePage;
