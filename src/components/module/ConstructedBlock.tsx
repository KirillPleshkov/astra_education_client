import * as React from "react";
import { TypeFetchModule } from "../../api/FetchModule";
import AutoChangedTextArea from "../UI/AutoChangedTextArea";
import { DefaultExtensionType, defaultStyles, FileIcon } from "react-file-icon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface IConstructedBlockProps {
  setModule: (value: React.SetStateAction<TypeFetchModule>) => void;
  elem: TypeFetchModule["blocks"][0];
  isDrag: boolean;
  id: string;
}

const formatFile: (fileName: string) => DefaultExtensionType = (fileName) => {
  const format = fileName.split(".").pop() as DefaultExtensionType;

  return format;
};

const ConstructedBlock: React.FunctionComponent<IConstructedBlockProps> = ({
  setModule,
  elem,
  isDrag,
  id,
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: elem.position,
    data: {
      type: "Block",
      block: elem,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const changeBlockNameHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    blockPos: number
  ) => {
    setModule((prev) => {
      const currentBlock = prev.blocks.find((el) => el.position == blockPos);

      if (!currentBlock) return prev;

      currentBlock.name = e.target.value;
      const newBlocks = [
        ...prev.blocks.filter((el) => el.position != blockPos),
        currentBlock,
      ];
      return { ...prev, blocks: newBlocks };
    });
  };

  const changeBlockMainTextHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    blockPos: number
  ) => {
    setModule((prev) => {
      const currentBlock = prev.blocks.find((el) => el.position == blockPos);

      if (!currentBlock) return prev;

      currentBlock.main_text = e.target.value;
      const newBlocks = [
        ...prev.blocks.filter((el) => el.position != blockPos),
        currentBlock,
      ];
      return { ...prev, blocks: newBlocks };
    });
  };

  if (isDragging)
    return (
      <div ref={setNodeRef} style={style} className="conblockDraggedBack"></div>
    );

  if (isDrag)
    return (
      <div
        id={id}
        className="moduleBlock"
        key={elem.position}
        ref={setNodeRef}
        style={{
          ...style,
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <div className="moduleBlockTitle" {...attributes} {...listeners}>
          <input
            value={elem.name}
            type="text"
            // className="moduleBlockTitleInput"
            onChange={(e) => changeBlockNameHandler(e, elem.position)}
          />
        </div>
        <div className="moduleBlockMainText">
          <AutoChangedTextArea
            isDropped={true}
            value={elem.main_text}
            className="moduleBlockMainTextArea"
            onChange={(e) => changeBlockMainTextHandler(e, elem.position)}
          />
        </div>
      </div>
    );

  return (
    <div
      className="moduleBlock"
      key={elem.position}
      ref={setNodeRef}
      style={style}
    >
      <div className="moduleBlockTitle" {...attributes} {...listeners}>
        <input
          value={elem.name}
          type="text"
          // className="moduleBlockTitleInput"
          onChange={(e) => changeBlockNameHandler(e, elem.position)}
        />
        {/* <button
                        className="moduleDeleteBlockButton"
                        onClick={() =>
                          setModule((prev) => {
                            return {
                              ...prev,
                              blocks: prev.blocks.filter(
                                (e) => e.position != elem.position
                              ),
                            };
                          })
                        }
                      >
                        <img src={Cross} alt="" className="moduleCrossImg" />
                      </button> */}
      </div>
      <div className="moduleBlockMainText">
        <AutoChangedTextArea
          isDropped={false}
          value={elem.main_text}
          className="moduleBlockMainTextArea"
          onChange={(e) => changeBlockMainTextHandler(e, elem.position)}
        />
      </div>

      {elem.files
        .sort((a, b) => a.position - b.position)
        .map((elem, index) => (
          <div className="file" key={index}>
            <a
              href={`http://127.0.0.1:8000/block/file/${elem.id}`}
              download
              key={elem.id}
              className="fileDownload"
            >
              <div className="fileImg">
                <FileIcon
                  extension={elem.file.split(".").pop()}
                  {...defaultStyles[formatFile(elem.file)]}
                />
              </div>
            </a>
            <div className="fileName">{elem.file.split("/").pop()}</div>
          </div>
        ))}
    </div>
  );
};

export default ConstructedBlock;
