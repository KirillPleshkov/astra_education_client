import * as React from "react";
import "./styles.css";
import SearchConstructor from "../../components/SearchConstructor";
import { useModuleList } from "../../hooks/UseModuleList";
import { fetchModuleCreate } from "../../api/FetchModuleCreate";

const MainConstructor: React.FunctionComponent = () => {
  return (
    <div className="mainContent">
      <div className="pageName">Конструктор</div>

      <div className="mainBlocks">
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
