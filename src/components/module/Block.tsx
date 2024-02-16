import * as React from "react";
import { DefaultExtensionType, FileIcon, defaultStyles } from "react-file-icon";

interface IBlockProps {
  name: string;
  main_text: string;
  files: {
    id: number;
    file: string;
    position: number;
  }[];
}

const Block: React.FunctionComponent<IBlockProps> = ({
  name,
  main_text,
  files,
}) => {
  const formatFile: (fileName: string) => DefaultExtensionType = (fileName) => {
    const format = fileName.split(".").pop() as DefaultExtensionType;

    return format;
  };

  return (
    <div className="block">
      <div className="blockTitle">{name}</div>
      <div className="blockMainText">{main_text}</div>

      {files
        .sort((a, b) => a.position - b.position)
        .map((elem) => (
          <div className="file">
            <a
              href={`http://127.0.0.1:8000/block/file/${elem.id}`}
              download
              key={elem.id}
            >
              <div className="fileImg">
                <FileIcon
                  extension={elem.file.split(".").pop()}
                  {...defaultStyles[formatFile(elem.file)]}
                />
              </div>
            </a>

            <a
              href={`http://127.0.0.1:8000/block/file/${elem.id}`}
              download
              key={elem.id}
            >
              <div className="fileName">{elem.file.split("/").pop()}</div>
            </a>
          </div>
        ))}
    </div>
  );
};

export default Block;
