import * as React from "react";
// import { useParams } from "react-router-dom";
import "./styles.css";
import DisciplineLayout from "../components/DisciplineLayout";

const DisciplinePage: React.FunctionComponent = () => {
  // const { disciplineId, moduleId } = useParams();

  return (
    <>
      <div className="disciplineName">Название дисциплины</div>
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <DisciplineLayout modules={[{ pk: 1, name: "few" }]} />
        <div>fergerge</div>
      </div>
    </>
  );
};

export default DisciplinePage;
