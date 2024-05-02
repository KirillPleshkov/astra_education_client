import * as React from "react";
import Module from "../components/module/Module";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAxios from "../services/api";
import { fetchModule } from "../api/Module/FetchModule";

const ModulePage: React.FunctionComponent = () => {
  const { moduleId } = useParams();

  const { api } = useAxios();

  const { data } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => fetchModule(api, moduleId),
    select: ({ data }) => data,
  });

  return (
    <div className="mainContent">
      <div className="disciplineName">{data?.name}</div>
      <Module />
    </div>
  );
};

export default ModulePage;
