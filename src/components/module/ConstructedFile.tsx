import * as React from "react";
import "./styles.css";
import { DefaultExtensionType, defaultStyles, FileIcon } from "react-file-icon";
import { ModuleBlockFile } from "../../pages/teacher_pages/ModuleConstructor";
import { useEffect, useState } from "react";
import Trash from "../../images/Trash.svg";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface IConstructedFileProps {
  file: ModuleBlockFile;
  isOverlay?: true;
  deleteFile: (id: number) => void;
}

const formatFile: (fileName: string) => DefaultExtensionType = (fileName) => {
  const format = fileName.split(".").pop() as DefaultExtensionType;

  return format;
};

const ConstructedFile: React.FunctionComponent<IConstructedFileProps> = ({
  file,
  isOverlay,
  deleteFile,
}) => {
  const [isHideTrashButton, setIsHideTrashButton] = useState<boolean>(true);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: file.id,
    data: {
      type: "File",
      file,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  useEffect(() => {
    setIsHideTrashButton(true);
  }, [file, isDragging]);

  useEffect(() => {
    setIsHideTrashButton(true);
  }, [file]);

  if (isDragging)
    return (
      <div className="constructedFile" ref={setNodeRef} style={style}>
        <a></a>
      </div>
    );

  return (
    <div
      className="constructedFile"
      onMouseEnter={() => setIsHideTrashButton(false)}
      onMouseLeave={() => setTimeout(() => setIsHideTrashButton(true), 30)}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <a
        href={`http://127.0.0.1:8000/block/file/${file.id}`}
        download
        key={file.id}
        className="fileDownload"
      >
        <div className="fileImg">
          <FileIcon
            extension={file.file.split(".").pop()}
            {...defaultStyles[formatFile(file.file)]}
          />
        </div>
      </a>

      <div className="constructedFileName">{file.file.split("/").pop()}</div>
      {!isHideTrashButton && !isOverlay ? (
        <button
          className="disciplineBlockModuleTrashButton"
          style={{ height: "24px", marginTop: 0 }}
          onClick={() => deleteFile(file.id)}
        >
          <img
            src={Trash}
            alt="Удалить элемент"
            className="disciplineBlockModuleTrashIcon"
          />
        </button>
      ) : (
        <div style={{ width: "30px" }}></div>
      )}
    </div>
  );
};

export default ConstructedFile;
