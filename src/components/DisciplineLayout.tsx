import * as React from "react";
import "./style.css";

type ModuleType = {
  modules: {
    pk: number;
    name: string;
  }[];
};

// interface IDisciplineLayoutProps extends Array<ModuleType> {}

const DisciplineLayout: React.FunctionComponent<ModuleType> = ({ modules }) => {
  console.log(modules);
  return <div className="layout"></div>;
};

export default DisciplineLayout;
