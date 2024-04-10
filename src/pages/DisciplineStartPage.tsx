import * as React from "react";
import { useParams } from "react-router-dom";
import "./styles.css";
import DisciplineLayout from "../components/DisciplineLayout";
import { fetchDiscipline } from "../api/Discipline/FetchDiscipline";
import { useQuery } from "@tanstack/react-query";
import DescriptionModule from "../components/module/DescriptionModule";
import useAxios from "../services/api";

const DisciplineStartPage: React.FunctionComponent = () => {
  const { disciplineId, curriculumId } = useParams();

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
        />
        <DescriptionModule
          short_description={data.short_description}
          products={data.products}
          skills={data.skills}
        />
      </div>
    </>
  );
};

export default DisciplineStartPage;
