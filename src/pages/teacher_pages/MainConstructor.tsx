import * as React from "react";
import "./styles.css";
import SearchConstructor from "../../components/SearchConstructor";
import { useModuleList } from "../../hooks/UseModuleList";
import { fetchModuleCreate } from "../../api/FetchModuleCreate";

const MainConstructor: React.FunctionComponent = () => {
  return (
    <div className="moduleContent">
      <div className="pageName">Конструктор</div>

      <div className="moduleBlocks">
        <SearchConstructor
          blockName="модуля"
          blockTitle="Конструирование модулей"
          useDataGet={useModuleList}
          fetchCreate={fetchModuleCreate}
          navigateUrl="/module_constructor"
        />
      </div>
    </div>
  );
};

export default MainConstructor;
