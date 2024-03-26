import * as React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import "./styles.css";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../services/api";
import { TypeFetchModule, fetchModule } from "../../api/FetchModule";
import { useEffect, useState } from "react";
import Edit from "../../images/Edit.svg";
import Module from "../../components/module/Module";
import ConstructedBlock from "../../components/module/ConstructedBlock";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

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

  const [activeBlock, setActiveBlock] = useState<
    TypeFetchModule["blocks"][0] | null
  >(null);

  const [isDrag, setIsDrag] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    if (data) {
      setModule(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // const mutation = useMutation({
  //   mutationFn: () => {
  //     return fetchUpdateModule(api, module, moduleId);
  //   },
  // });

  const blocksId = React.useMemo(
    () => module.blocks.map((e) => e.position),
    [module]
  );

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

  const onDragStart = (e: DragStartEvent) => {
    setIsDrag(true);
    if (e.active.data.current?.type === "Block") {
      setActiveBlock(e.active.data.current.block);
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setIsDrag(false);
    const { active, over } = e;
    if (!over) return;

    const activeBlockPos = active.id;
    const overBlockPos = over.id;

    if (activeBlockPos === overBlockPos) return;

    setModule((prev) => {
      const blocks = [...prev.blocks];

      const activeBlockIndex = blocks.findIndex(
        (e) => e.position === activeBlockPos
      );
      const overBlockIndex = blocks.findIndex(
        (e) => e.position === overBlockPos
      );

      const updatedBlocks = arrayMove(blocks, activeBlockIndex, overBlockIndex);

      return {
        ...prev,
        blocks: updatedBlocks.map((e, index) => {
          return { ...e, position: index + 1 };
        }),
      };
    });

    const element = document.getElementById(`block_${e.over?.id}`);

    setTimeout(() => {
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY;
        window.scroll({
          top: y - 300,
          behavior: "smooth",
        });
      }
    }, 10);
  };

  console.log(module);

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
          <DndContext
            autoScroll={{ acceleration: 1 }}
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <div className="moduleCentered">
              <SortableContext items={blocksId}>
                {module &&
                  module.blocks
                    .sort((a, b) => a.position - b.position)
                    .map((elem) => (
                      <ConstructedBlock
                        id={`block_${elem.position}`}
                        isDrag={isDrag}
                        setModule={setModule}
                        elem={elem}
                        key={elem.position}
                      />
                    ))}
              </SortableContext>

              <button
                className="moduleAddBlockButton"
                onClick={addBlockHandler}
              >
                + Добавить новый Блок
              </button>
            </div>
            {/* {createPortal( */}
            <DragOverlay dropAnimation={null}>
              {activeBlock && (
                // <div>Привет</div>
                <ConstructedBlock
                  id={`block`}
                  elem={activeBlock}
                  setModule={setModule}
                  isDrag={isDrag}
                />
              )}
            </DragOverlay>
            ,
            {/* document.body
            )} */}
          </DndContext>
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
          <Module />
        </div>
      )}
    </>
  );
};

export default ModuleConstructor;
