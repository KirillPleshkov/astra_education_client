import * as React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import "./styles.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchUpdateModule } from "../../api/FetchUpdateModule";
import useAxios from "../../services/api";
import { TypeFetchModule, fetchModule } from "../../api/FetchModule";
import { useEffect, useState } from "react";
import { DefaultExtensionType, FileIcon, defaultStyles } from "react-file-icon";
import Edit from "../../images/Edit.svg";
import Cross from "../../images/Cross.svg";
import AutoChangedTextArea from "../../components/UI/AutoChangedTextArea";

const ModuleConstructor: React.FunctionComponent = () => {
  const { moduleId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const { api } = useAxios();

  const [module, setModule] = useState<TypeFetchModule>({
    id: "",
    name: "",
    blocks: [],
  });

  const { data, isLoading } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => fetchModule(api, moduleId),
    select: ({ data }) => data,
  });

  useEffect(() => {
    if (data) {
      setModule(data);
    }
  }, [isLoading]);

  const mutation = useMutation({
    mutationFn: () => {
      return fetchUpdateModule(api, module, moduleId);
    },
  });

  const formatFile: (fileName: string) => DefaultExtensionType = (fileName) => {
    const format = fileName.split(".").pop() as DefaultExtensionType;

    return format;
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

  const addBlockHandler = () => {
    setModule((prev) => {
      const countNewBlocks = prev.blocks.filter((e) => !e.id).length;

      return {
        ...prev,
        blocks: [
          ...prev.blocks,
          {
            name: `Новый блок ${countNewBlocks ? `(${countNewBlocks})` : ""}`,
            main_text: "",
            files: [],
            module: prev.id,
            position: prev.blocks.length + 1,
          },
        ],
      };
    });
  };

  return (
    <>
      {searchParams.get("edit") === "true" ? (
        <div className="moduleContent">
          <div className="pageName">
            <input
              value={module.name}
              onChange={(e) =>
                setModule((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
            />
          </div>
          <div className="moduleCentered">
            {module &&
              module.blocks
                .sort((a, b) => a.position - b.position)
                .map((elem, index) => (
                  <div className="moduleBlock" key={index}>
                    <div className="moduleBlockTitle">
                      <input
                        value={elem.name}
                        type="text"
                        className="moduleBlockTitleInput"
                        onChange={(e) =>
                          changeBlockNameHandler(e, elem.position)
                        }
                      />
                      <button
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
                      </button>
                    </div>
                    <div className="moduleBlockMainText">
                      <AutoChangedTextArea
                        value={elem.main_text}
                        className="moduleBlockMainTextArea"
                        onChange={(e) =>
                          changeBlockMainTextHandler(e, elem.position)
                        }
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
                          <div className="fileName">
                            {elem.file.split("/").pop()}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
            <button className="moduleAddBlockButton" onClick={addBlockHandler}>
              + Добавить новый Блок
            </button>
          </div>
        </div>
      ) : (
        <div className="moduleContent">
          <button
            className="moduleEditButton"
            onClick={() =>
              setSearchParams({
                edit: "true",
              })
            }
          >
            <img src={Edit} alt="React Logo" className="moduleEditImg" />
          </button>

          <div className="pageName">{module.name}</div>

          <div className="moduleCentered">
            {module &&
              module.blocks
                .sort((a, b) => a.position - b.position)
                .map((elem, index) => (
                  <div className="block" key={index}>
                    <div className="blockTitle">{elem.name}</div>
                    <div className="blockMainText">{elem.main_text}</div>

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

                            <div className="fileName">
                              {elem.file.split("/").pop()}
                            </div>
                          </a>
                        </div>
                      ))}
                  </div>
                ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ModuleConstructor;
