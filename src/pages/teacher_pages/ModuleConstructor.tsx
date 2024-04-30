import * as React from "react";
import "./styles.css";
import SearchConstructor from "../../components/SearchConstructor";
import { useModuleList } from "../../hooks/UseModuleList";
import { useMemo, useState } from "react";
import useAxios from "../../services/api";
import { fetchModuleCreate } from "../../api/Module/FetchModuleCreate";
import ConstructedBlock from "../../components/module/ConstructedBlock";
import ModuleCombobox, { ModuleMode } from "../../components/UI/ModuleCombobox";
import { fetchModule, TypeFetchModule } from "../../api/Module/FetchModule";
import { Confirm } from "./DisciplineConstructor";
import ModalConfirm from "../../components/modal/ModalConfirm";
import { fetchModuleDelete } from "../../api/Module/FetchModuleDelete";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import ConstructedFile from "../../components/module/ConstructedFile";
import { fetchUpdateModule } from "../../api/Module/FetchUpdateModule";
import InfoMessage from "../../components/UI/InfoMessage";

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

  const [draggableBlock, setDraggableBlock] = useState<ModuleBlock | null>(
    null
  );

  const [draggableFile, setDraggableFile] = useState<ModuleBlockFile | null>(
    null
  );

  const blocksId = useMemo(() => blocks.map((e) => e.dndId), [blocks]);

  const [message, setMessage] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

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
        addMessage("Модуль успешно удален", true);
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

  const addFile = (newFile: ModuleBlockFile) => {
    setFiles((prev) => {
      return [...prev, newFile];
    });
  };

  const deleteFile = (id: number) => {
    setFiles((prev) => prev.filter((e) => e.id !== id));
  };

  const sensor = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Block") {
      setDraggableBlock(e.active.data.current?.block);
    }

    if (e.active.data.current?.type === "File") {
      setDraggableFile(e.active.data.current?.file);
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setDraggableBlock(null);
    setDraggableFile(null);

    const { active, over } = e;

    if (active.data.current?.type === "Block") {
      if (!over) return;

      const activeDisciplineId = active.id;
      const overDisciplineId = over.id;

      if (activeDisciplineId === overDisciplineId) return;

      setBlocks((prev) => {
        const activeDisciplineIndex = prev.findIndex(
          (e) => e.dndId === activeDisciplineId
        );
        const overDisciplineIndex = prev.findIndex(
          (e) => e.dndId === overDisciplineId
        );
        return arrayMove(prev, activeDisciplineIndex, overDisciplineIndex);
      });
    }
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;

    if (!over) return;

    const activeModuleId = active.id;
    const overModuleId = over.id;

    if (activeModuleId === overModuleId) return;

    const isActiveModule = active.data.current?.type === "File";
    const isOverModule = over.data.current?.type === "File";

    if (!isActiveModule) return;

    if (isActiveModule && isOverModule) {
      setFiles((prev) => {
        const activeModuleIndex = prev.findIndex(
          (e) => e.id === activeModuleId
        );
        const overModuleIndex = prev.findIndex((e) => e.id === overModuleId);

        prev[activeModuleIndex].blockId = prev[overModuleIndex].blockId;

        return arrayMove(prev, activeModuleIndex, overModuleIndex);
      });
    }

    const isOverADiscipline = over.data.current?.type === "Block";

    if (isActiveModule && isOverADiscipline) {
      setFiles((prev) => {
        const activeModuleIndex = prev.findIndex(
          (e) => e.id === activeModuleId
        );

        prev[activeModuleIndex].blockId = Number(overModuleId);

        return arrayMove(prev, activeModuleIndex, activeModuleIndex);
      });
    }
  };

  const saveModule = () => {
    if (!module) return;

    const moduleToSave: TypeFetchModule = {
      ...module,
      id: `${module?.id}`,
      blocks: blocks.map((block, blockIndex) => {
        return {
          ...block,
          module: module?.id,
          position: blockIndex + 1,
          files: files
            .filter((e) => e.blockId === block.dndId)
            .map((file, fileIndex) => {
              return { ...file, position: fileIndex + 1 };
            }),
        };
      }),
    };

    fetchUpdateModule(api, moduleToSave, moduleToSave.id).then(() => {
      console.log("Saved");
    });
  };

  const addMessage = (message: string, success: boolean) => {
    setMessage({ message, success });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const clearMessage = () => {
    setMessage(null);
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
        {module && (
          <div style={{ marginLeft: "30px", marginTop: "24px" }}>
            <button
              onClick={() => {
                saveModule();
              }}
              className="DisciplineButton"
            >
              Сохранить модуль
            </button>
          </div>
        )}
      </div>
      <DndContext
        sensors={sensor}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <SortableContext items={blocksId}>
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
                  addFile={addFile}
                  deleteFile={deleteFile}
                />
              ))}

              <button onClick={() => addBlock()} className="addBlockButton">
                + Добавить блок
              </button>
            </div>
          )}
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {draggableBlock && (
              <ConstructedBlock
                block={draggableBlock}
                blockIdToChangeTitle={blockIdToChangeTitle}
                setBlockIdToChangeTitle={setBlockIdToChangeTitle}
                changeBlockName={changeBlockName}
                changeBlockMainText={changeBlockMainText}
                mode={mode}
                files={files.filter((e) => e.blockId === draggableBlock.dndId)}
                addFile={addFile}
                deleteFile={deleteFile}
              />
            )}
            {draggableFile && (
              <ConstructedFile
                file={draggableFile}
                deleteFile={deleteFile}
                isOverlay={true}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      <ModalConfirm
        isOpen={blockIdToModal !== undefined}
        setIsOpen={setBlockIdToModal}
        confirmFunc={confirmModes(modalConfirmMode).confirmFunc}
        text={confirmModes(modalConfirmMode).text}
      />
      {message && (
        <InfoMessage
          message={message.message}
          clear={clearMessage}
          success={message.success}
        />
      )}
    </div>
  );
};

export default ModuleConstructor;
