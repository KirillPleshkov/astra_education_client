import * as React from "react";
import "./styles.css";
import {
  ModuleBlock,
  ModuleBlockFile,
} from "../../pages/teacher_pages/ModuleConstructor";
import { ModuleMode } from "../UI/ModuleCombobox";
import { DefaultExtensionType, defaultStyles, FileIcon } from "react-file-icon";

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
}

const formatFile: (fileName: string) => DefaultExtensionType = (fileName) => {
  const format = fileName.split(".").pop() as DefaultExtensionType;

  return format;
};

const ConstructedBlock: React.FunctionComponent<IConstructedBlockProps> = ({
  block,
  blockIdToChangeTitle,
  setBlockIdToChangeTitle,
  changeBlockName,
  changeBlockMainText,
  mode,
  files,
}) => {
  const addFile = (e: FormEventHandler<HTMLFormElement>) => {};

  return (
    <div className="constructedModuleBlock1">
      <div
        className="constructedModuleBlockTitle"
        onClick={() => setBlockIdToChangeTitle(block.dndId)}
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
          <div>
            {files.map((e, index) => (
              <div className="file" key={index}>
                <a
                  href={`http://127.0.0.1:8000/block/file/${e.id}`}
                  download
                  key={e.id}
                  className="fileDownload"
                >
                  <div className="fileImg">
                    <FileIcon
                      extension={e.file.split(".").pop()}
                      {...defaultStyles[formatFile(e.file)]}
                    />
                  </div>
                </a>

                <div className="fileName">{e.file.split("/").pop()}</div>
              </div>
            ))}
          </div>
          <form onSubmit={addFile}>
            <div className="input_container">
              <input type="file" id="fileUpload" className="input_file" />
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
