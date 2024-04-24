import * as React from "react";
import "./styles.css";
import SearchConstructor from "../../components/SearchConstructor";
import { useModuleList } from "../../hooks/UseModuleList";
import { useState } from "react";
import useAxios from "../../services/api";
import { fetchModuleCreate } from "../../api/Module/FetchModuleCreate";
import ConstructedBlock from "../../components/module/ConstructedBlock";
import ModuleCombobox, { ModuleMode } from "../../components/UI/ModuleCombobox";
import { fetchModule } from "../../api/Module/FetchModule";
import { Confirm } from "./DisciplineConstructor";
import ModalConfirm from "../../components/modal/ModalConfirm";
import { fetchModuleDelete } from "../../api/Module/FetchModuleDelete";

type Module = {
  id: number;
  name: string;
};

export type ModuleBlock = {
  id?: number;
  dndId: number;
  name: string;
  main_text: string;
};

export type ModuleBlockFile = {
  id: number;
  file: string;
  blockId: number;
};

const ModuleConstructor: React.FunctionComponent = () => {
  const [mode, setMode] = useState<ModuleMode>(ModuleMode.Text);

  const [module, setModule] = useState<Module | null>(null);

  const [blocks, setBlocks] = useState<ModuleBlock[]>([]);

  const [files, setFiles] = useState<ModuleBlockFile[]>([]);

  const [blockIdToChangeTitle, setBlockIdToChangeTitle] = useState<number>();

  const [isNameChange, setISNameChange] = useState<boolean>(false);

  const [blockIdToModal, setBlockIdToModal] = useState<number>();

  const [modalConfirmMode, setModalConfirmMode] = useState<Confirm>(
    Confirm.Delete
  );

  const { api } = useAxios();

  const createNewModule = (name: string) => {
    return fetchModuleCreate(api, name);
  };

  const moduleNameChange = (name: string) => {
    setModule((prev) => {
      if (!prev) return prev;

      return { ...prev, name };
    });
  };

  const addBlock = () => {
    const newBlock: ModuleBlock = {
      dndId: new Date().getTime(),
      name: "Новый блок модуля",
      main_text: "",
    };

    setBlocks((prev) => {
      return [...prev, newBlock];
    });
  };

  const addModule = ({ id }: { id: number; name: string }) => {
    fetchModule(api, `${id}`).then(({ data }) => {
      setModule({ id: Number(data.id), name: data.name });

      const newBlocks = data.blocks.map((e, index) => {
        return { ...e, dndId: new Date().getTime() * 1000 + index };
      });
      setBlocks(newBlocks);

      const newFiles: ModuleBlockFile[] = [];

      newBlocks
        .sort((a, b) => a.position - b.position)
        .forEach((block) =>
          block.files
            .sort((a, b) => a.position - b.position)
            .forEach((file) => newFiles.push({ ...file, blockId: block.dndId }))
        );

      setFiles(newFiles);
    });
  };

  const changeBlockName = (dndId: number, name: string) => {
    setBlocks((prev) => {
      return prev.map((e) => (e.dndId === dndId ? { ...e, name } : e));
    });
  };

  const changeBlockMainText = (dndId: number, main_text: string) => {
    setBlocks((prev) => {
      return prev.map((e) => (e.dndId === dndId ? { ...e, main_text } : e));
    });
  };

  const removeBlock = () => {
    setBlocks((prev) => {
      return prev.filter((e) => e.dndId !== blockIdToModal);
    });

    setBlockIdToModal(undefined);
  };

  const deleteModule = () => {
    fetchModuleDelete(api, module?.id)
      .then(() => {
        setBlocks([]);
        setModule(null);
      })
      .catch((e) => {
        console.log(e);
      });

    setBlockIdToModal(undefined);
  };

  const confirmModes = (confirm: Confirm) => {
    if (confirm === Confirm.Delete) {
      return {
        text: "Вы уверены что хотите безвозвратно удалить модуль?",
        confirmFunc: deleteModule,
      };
    } else {
      return {
        text: "Вы уверены что хотите убрать блок? Несохраненные данные пропадут.",
        confirmFunc: removeBlock,
      };
    }
  };

  return (
    <div className="moduleContent">
      <div className="pageName">Конструктор модулей</div>

      <div className="disciplineAddBlock">
        <div>
          <label className="searchConstructorText-field__label">
            Введите название модуля
          </label>
          <SearchConstructor
            key={1}
            createText="+ Создать новый модуль с введенным названием"
            blockName="модуля"
            useDataGet={useModuleList}
            setSelectedElement={addModule}
            createNewF={createNewModule}
            width={500}
          />
        </div>

        <div style={{ marginLeft: "30px" }}>
          <label className="searchConstructorText-field__label">
            Режим отображения
          </label>
          <ModuleCombobox mode={mode} setMode={setMode} />
        </div>

        {blockIdToChangeTitle && (
          <div style={{ marginLeft: "30px", marginTop: "24px" }}>
            <button
              onClick={() => {
                setBlockIdToModal(blockIdToChangeTitle);
                setModalConfirmMode(Confirm.Remove);
              }}
              className="DisciplineButton"
            >
              Убрать блок
            </button>
          </div>
        )}

        {module && (
          <div style={{ marginLeft: "30px", marginTop: "24px" }}>
            <button
              onClick={() => {
                setBlockIdToModal(1);
                setModalConfirmMode(Confirm.Delete);
              }}
              className="DisciplineButton"
            >
              Удалить модуль
            </button>
          </div>
        )}
      </div>

      {module && (
        <div className="moduleCon">
          <div className="moduleName" onClick={() => setISNameChange(true)}>
            {isNameChange ? (
              <input
                className="disciplineBlockTitleInput"
                type="text"
                onBlur={() => setTimeout(() => setISNameChange(false), 100)}
                autoFocus
                value={module.name}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    setTimeout(() => setISNameChange(false), 100);
                  }
                }}
                onChange={(e) => moduleNameChange(e.target.value)}
                style={{ margin: "auto" }}
              />
            ) : (
              <>{module.name}</>
            )}
          </div>

          {blocks.map((block, index) => (
            <ConstructedBlock
              block={block}
              key={index}
              blockIdToChangeTitle={blockIdToChangeTitle}
              setBlockIdToChangeTitle={setBlockIdToChangeTitle}
              changeBlockName={changeBlockName}
              changeBlockMainText={changeBlockMainText}
              mode={mode}
              files={files.filter((e) => e.blockId === block.dndId)}
              // files={files.filter((e) => e.blockId === block.dndId)}
            />
          ))}

          <button onClick={() => addBlock()} className="addBlockButton">
            + Добавить блок
          </button>
        </div>
      )}

      <ModalConfirm
        isOpen={blockIdToModal !== undefined}
        setIsOpen={setBlockIdToModal}
        confirmFunc={confirmModes(modalConfirmMode).confirmFunc}
        text={confirmModes(modalConfirmMode).text}
      />
    </div>
  );
};

export default ModuleConstructor;
