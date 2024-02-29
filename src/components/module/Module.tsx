import * as React from "react";
import "./styles.css";
import Block from "./Block";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchModule } from "../../api/FetchModule";
import useAxios from "../../services/api";

interface IModuleProps {}

const Module: React.FunctionComponent<IModuleProps> = () => {
  const { moduleId } = useParams();

  const { api } = useAxios();

  const { data } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => fetchModule(api, moduleId),
    select: ({ data }) => data,
  });

  console.log(data?.blocks);

  return (
    <div className="module">
      {data?.blocks
        .sort((a, b) => a.position - b.position)
        .map((elem) => (
          <Block
            name={elem.name}
            main_text={elem.main_text}
            files={elem.files}
            key={elem.id}
          />
        ))}
    </div>
  );
};

export default Module;
