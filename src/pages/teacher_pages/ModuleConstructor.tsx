import * as React from "react";
import { useParams } from "react-router-dom";
import "./styles.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchUpdateModule } from "../../api/FetchUpdateModule";
import useAxios from "../../services/api";
import { TypeFetchModule, fetchModule } from "../../api/FetchModule";
import { useEffect, useState } from "react";

const ModuleConstructor: React.FunctionComponent = () => {
  const { moduleId } = useParams();

  const { api } = useAxios();

  const [module, setModule] = useState<TypeFetchModule>({
    id: "",
    name: "",
    blocks: [],
  });

  const { data } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => fetchModule(api, moduleId),
    select: ({ data }) => data,
  });

  useEffect(() => {
    if (data) {
      setModule(data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => {
      return fetchUpdateModule(api, module, moduleId);
    },
  });

  console.log(module);

  return (
    <div className="moduleContent">
      <div className="pageName">{module.name}</div>
      <button
        onClick={() => {
          mutation.mutate();
        }}
      >
        Жмак
      </button>
      <button
        onClick={() => {
          setModule((prev) => {
            return { ...prev, name: "7777" };
          });
        }}
      >
        Пук
      </button>
    </div>
  );
};

export default ModuleConstructor;
