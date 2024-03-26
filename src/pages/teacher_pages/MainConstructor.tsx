import * as React from "react";
import "./styles.css";
import SearchConstructor from "../../components/SearchConstructor";
import { useModuleList } from "../../hooks/UseModuleList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../services/api";
import { fetchModuleCreate } from "../../api/FetchModuleCreate";

const MainConstructor: React.FunctionComponent = () => {
  const [module, setModule] = useState<{ id?: number; name: string }>();

  const navigator = useNavigate();
  const { api } = useAxios();

  useEffect(() => {
    if (!module) return;

    if (module.id) {
      navigator(`/module_constructor/${module.id}`);
    } else {
      fetchModuleCreate(api, module.name).then(({ data }) => {
        navigator(`/module_constructor/${data.id}`);
      });
    }
  }, [module]);

  return (
    <div className="mainContent">
      <div className="pageName">Конструктор</div>

      <div className="mainBlocks">
        <div className="searchConstructorBlock">
          <div className="searchConstructorTitle">Конструирование модулей</div>
          <div className="searchConstructorText-field">
            <label className="searchConstructorText-field__label">
              Введите название модуля
            </label>
            <SearchConstructor
              blockName="модуля"
              useDataGet={useModuleList}
              setSelectedElement={setModule}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainConstructor;
function fetchCreate(api: any, name: void) {
  throw new Error("Function not implemented.");
}
