import * as React from "react";
import { useParams } from "react-router-dom";

const ModulePage: React.FunctionComponent = () => {
  const { moduleId } = useParams();

  return <div>Module {moduleId}</div>;
};

export default ModulePage;
