import * as React from "react";
import "./styles.css";
import {
  ModuleBlock,
  ModuleBlockFile,
} from "../../pages/teacher_pages/ModuleConstructor";
import { ModuleMode } from "../UI/ModuleCombobox";
import { DefaultExtensionType, defaultStyles, FileIcon } from "react-file-icon";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEventHandler,
  useMemo,
  useState,
} from "react";
import { fetchFileUpload } from "../../api/File/FetchFileUpload";
import useAxios from "../../services/api";
import ConstructedFile from "./ConstructedFile";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface IConstructedBlockProps {
  block: ModuleBlock;
  blockIdToChangeTitle: number | undefined;
  setBlockIdToChangeTitle: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  changeBlockName: (dndId: number, name: string) => void;
  changeBlockMainText: (dndId: number, main_text: string) => void;
  mode: ModuleMode;
  files: ModuleBlockFile[];
  addFile: (newFile: ModuleBlockFile) => void;
  deleteFile: (id: number) => void;
}

const ConstructedBlock: React.FunctionComponent<IConstructedBlockProps> = ({
  block,
  blockIdToChangeTitle,
  setBlockIdToChangeTitle,
  changeBlockName,
  changeBlockMainText,
  mode,
  files,
  addFile,
  deleteFile,
}) => {
  const { api } = useAxios();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.dndId,
    data: {
      type: "Block",
      block,
    },
    disabled: blockIdToChangeTitle === block.dndId,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const fetchFile: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    e.currentTarget.elements[0].value = null;

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("position", "0");

    fetchFileUpload(api, formData).then(({ data }) => {
      addFile({ id: data.id, file: data.file, blockId: block.dndId });
      setSelectedFile(null);
    });
  };

  const addFileObject = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const filesId = useMemo(() => files.map((e) => e.id), [files]);

  if (isDragging)
    return (
      <div
        className="constructedModuleBlockDraggableBackground"
        ref={setNodeRef}
        style={style}
      ></div>
    );

  return (
    <div className="constructedModuleBlock1" ref={setNodeRef} style={style}>
      <div
        className="constructedModuleBlockTitle"
        onClick={() => setBlockIdToChangeTitle(block.dndId)}
        {...attributes}
        {...listeners}
      >
        {blockIdToChangeTitle === block.dndId ? (
          <input
            className="constructedModuleBlockTitleInput"
            type="text"
            onBlur={() =>
              setTimeout(() => setBlockIdToChangeTitle(undefined), 100)
            }
            autoFocus
            value={block.name}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                setBlockIdToChangeTitle(undefined);
              }
            }}
            onChange={(e) => changeBlockName(block.dndId, e.target.value)}
          />
        ) : (
          <>{block.name}</>
        )}
      </div>

      {mode === ModuleMode.Text && (
        <textarea
          className="constructedModuleBlockTextarea"
          value={block.main_text}
          onChange={(e) => changeBlockMainText(block.dndId, e.target.value)}
        />
      )}

      {mode === ModuleMode.Files && (
        <>
          <div className="filesArea">
            <SortableContext items={filesId}>
              {files.map((e, index) => (
                <ConstructedFile file={e} key={index} deleteFile={deleteFile} />
              ))}
            </SortableContext>
          </div>
          <form onSubmit={fetchFile}>
            <div className="input_container">
              <input
                type="file"
                id="fileUpload"
                className="input_file"
                onChange={addFileObject}
              />
              <button className="addFileButton" type="submit">
                Добавить выбранный файл
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ConstructedBlock;
