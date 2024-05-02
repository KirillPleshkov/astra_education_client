import * as React from "react";
import "./styles.css";
import SearchConstructor from "../../components/SearchConstructor";
import { useDisciplineList } from "../../hooks/UseDisciplineList";
import { useMemo, useState } from "react";
import Combobox, { Mode } from "../../components/UI/Combobox";
import { useModuleList } from "../../hooks/UseModuleList";
import {
  fetchDisciplineCreate,
  TypeFetchCreated,
} from "../../api/Discipline/FetchDisciplineCreate";
import useAxios from "../../services/api";
import DisciplineBlock from "../../components/disciplineConstructor/DisciplineBlock";
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
import DisciplineBlockElement from "../../components/disciplineConstructor/DisciplineBlockElement";
import { useProductList } from "../../hooks/UseProductList";
import { useSkillList } from "../../hooks/UseSkillList";
import {
  fetchDiscipline,
  TypeFetchDiscipline,
} from "../../api/Discipline/FetchDiscipline";
import ModalConfirm from "../../components/modal/ModalConfirm";
import { fetchDisciplineDelete } from "../../api/Discipline/FetchDisciplineDelete";
import { AxiosError } from "axios";
import { fetchDisciplineUpdate } from "../../api/Discipline/FetchDisciplineUpdate";
import { fetchSkillCreate } from "../../api/Skills_products/FetchCreateSkill";
import { fetchProductCreate } from "../../api/Skills_products/FetchCreateProduct";
import InfoMessage from "../../components/UI/InfoMessage";

export type Discipline = {
  id: number;
  name: string;
  short_description: string;
};

export type DisciplineElement = {
  dndId: number;
  id: number;
  name: string;
  disciplineId: number;
};

export enum Confirm {
  Delete,
  Remove,
}

const DisciplineConstructor: React.FunctionComponent = () => {
  const { api } = useAxios();

  const [mode, setMode] = useState<Mode>(Mode.Modules);

  const [isCopyElement, setIsCopyElement] = useState<boolean>(false);

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  const [modules, setModules] = useState<DisciplineElement[]>([]);

  const [skills, setSkills] = useState<DisciplineElement[]>([]);

  const [products, setProducts] = useState<DisciplineElement[]>([]);

  const [draggableDiscipline, setDraggableDiscipline] =
    useState<Discipline | null>(null);

  const [draggableElement, setDraggableElement] =
    useState<DisciplineElement | null>(null);

  const [draggableElementStartParams, setDraggableElementStartParams] =
    useState<{ disciplineId: number; pos: number } | null>(null);

  const [disciplineIdToCreateElement, setDisciplineIdToCreateElement] =
    useState<number>();

  const [disciplineIdToChangeTitle, setDisciplineIdToChangeTitle] =
    useState<number>();

  const [modalConfirmMode, setModalConfirmMode] = useState<Confirm>(
    Confirm.Delete
  );

  const [disciplineIdToModal, setDisciplineIdToModal] = useState<number>();

  const [message, setMessage] = useState<{
    text: string;
    success: boolean;
  } | null>(null);
  const disciplinesId = useMemo(
    () => disciplines.map((e) => e.id),
    [disciplines]
  );

  const addDiscipline = async ({ id, name }: { id: number; name: string }) => {
    if (disciplines.some((e) => e.id === id)) {
      addMessage("Дисциплина с таким названием уже добавлена", false);
      return;
    }

    const { data } = await fetchDiscipline(api, `${id}`);

    setDisciplines((prev) => {
      return [...prev, { id, name, short_description: data.short_description }];
    });

    const modules = data.modules
      .sort((a, b) => a.position - b.position)
      .map((el, index) => {
        return {
          id: el.module.id,
          name: el.module.name,
          disciplineId: id,
          dndId: Math.round(new Date().getTime() * 100 + index),
        };
      });

    const products = data.products.map((product, index) => {
      return {
        id: product.id,
        name: product.name,
        disciplineId: id,
        dndId: Math.round(new Date().getTime() * 100 + index),
      };
    });

    const skills = data.skills.map((skill, index) => {
      return {
        id: skill.id,
        name: skill.name,
        disciplineId: id,
        dndId: Math.round(new Date().getTime() * 100 + index),
      };
    });

    setModules((prev) => {
      return [...prev, ...modules];
    });

    setProducts((prev) => {
      return [...prev, ...products];
    });

    setSkills((prev) => {
      return [...prev, ...skills];
    });
  };

  const addElement = ({ id, name }: { id: number; name: string }) => {
    if (!disciplineIdToCreateElement) return;

    if (
      mode === Mode.Modules &&
      modules
        .filter((e) => e.disciplineId === disciplineIdToCreateElement)
        .some((e) => e.id === id)
    ) {
      addMessage("Модуль с таким названием уже добавлен", false);
      return;
    }

    if (
      mode === Mode.Skills &&
      skills
        .filter((e) => e.disciplineId === disciplineIdToCreateElement)
        .some((e) => e.id === id)
    ) {
      addMessage("Навык с таким названием уже добавлен", false);
      return;
    }

    if (
      mode === Mode.Products &&
      products
        .filter((e) => e.disciplineId === disciplineIdToCreateElement)
        .some((e) => e.id === id)
    ) {
      addMessage("Продукт с таким названием уже добавлен", false);
      return;
    }

    const newElement = {
      id,
      name,
      disciplineId: disciplineIdToCreateElement,
      dndId: new Date().getTime(),
    };

    if (mode === Mode.Modules) setModules((prev) => [...prev, newElement]);

    if (mode === Mode.Skills) setSkills((prev) => [...prev, newElement]);

    if (mode === Mode.Products) setProducts((prev) => [...prev, newElement]);
  };

  const createNewDiscipline = async (name: string) => {
    let result: TypeFetchCreated | undefined;
    await fetchDisciplineCreate(api, name)
      .then(({ data }) => (result = data))
      .then(() => {
        addMessage("Дисциплина успешно создана.", true);
      })
      .catch(() => {
        addMessage("Произошла ошибка. Дисциплину создать не удалось", false);
      });

    return result;
  };

  const createNewSkill = async (name: string) => {
    let result: TypeFetchCreated | undefined;
    await fetchSkillCreate(api, name)
      .then(({ data }) => (result = data))
      .then(() => {
        addMessage("Навык успешно создан.", true);
      })
      .catch(() => {
        addMessage("Произошла ошибка. Навык создать не удалось", false);
      });

    return result;
  };

  const createNewProduct = async (name: string) => {
    let result: TypeFetchCreated | undefined;
    await fetchProductCreate(api, name)
      .then(({ data }) => (result = data))
      .then(() => {
        addMessage("Продукт успешно создан.", true);
      })
      .catch(() => {
        addMessage("Произошла ошибка. Продукт создать не удалось", false);
      });

    return result;
  };

  const onBlurSearch = () => {
    setDisciplineIdToCreateElement(undefined);
  };

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Discipline") {
      setDraggableDiscipline(e.active.data.current?.discipline);
    }

    if (e.active.data.current?.type === "Element") {
      const elem = e.active.data.current.element;

      setDraggableElement(elem);
      setDraggableElementStartParams({
        disciplineId: elem.disciplineId,
        pos: elements
          .filter((e) => e.disciplineId === elem.disciplineId)
          .findIndex((e) => e.id === elem.id),
      });
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setDraggableDiscipline(null);
    setDraggableElement(null);

    const { active, over } = e;

    if (active.data.current?.type === "Discipline") {
      if (!over) return;

      const activeDisciplineId = active.id;
      const overDisciplineId = over.id;

      if (activeDisciplineId === overDisciplineId) return;

      setDisciplines((prev) => {
        const activeDisciplineIndex = prev.findIndex(
          (e) => e.id === activeDisciplineId
        );
        const overDisciplineIndex = prev.findIndex(
          (e) => e.id === overDisciplineId
        );
        return arrayMove(prev, activeDisciplineIndex, overDisciplineIndex);
      });
    } else {
      if (
        !isCopyElement ||
        !active.data.current ||
        !draggableElementStartParams
      )
        return;

      if (
        draggableElementStartParams.disciplineId ===
        active.data.current.element.disciplineId
      )
        return;

      const newElement = {
        id: active.data.current.element.id,
        name: active.data.current.element.name,
        disciplineId: draggableElementStartParams.disciplineId,
        dndId: new Date().getTime(),
      };

      const copyElement = (prev: DisciplineElement[]) => {
        const newDisciplineElements = prev.filter(
          (e) => e.disciplineId === draggableElementStartParams.disciplineId
        );

        newDisciplineElements.splice(
          draggableElementStartParams.pos,
          0,
          newElement
        );

        return [
          ...prev.filter(
            (e) => e.disciplineId !== draggableElementStartParams.disciplineId
          ),
          ...newDisciplineElements,
        ];
      };

      if (mode === Mode.Modules) setModules(copyElement);
      if (mode === Mode.Products) setProducts(copyElement);
      if (mode === Mode.Skills) setSkills(copyElement);
    }
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;

    if (!over) return;

    const activeModuleId = active.id;
    const overModuleId = over.id;

    if (activeModuleId === overModuleId) return;

    const isActiveModule = active.data.current?.type === "Element";
    const isOverModule = over.data.current?.type === "Element";

    if (!isActiveModule) return;

    if (isActiveModule && isOverModule) {
      const swapElements = (prev: DisciplineElement[]) => {
        const activeModuleIndex = prev.findIndex(
          (e) => e.dndId === activeModuleId
        );
        const overModuleIndex = prev.findIndex((e) => e.dndId === overModuleId);

        if (
          prev
            .filter(
              (e) => e.disciplineId === prev[overModuleIndex].disciplineId
            )
            .some(
              (e) =>
                e.id === prev[activeModuleIndex].id &&
                e.dndId !== prev[activeModuleIndex].dndId
            )
        )
          return prev;

        prev[activeModuleIndex].disciplineId =
          prev[overModuleIndex].disciplineId;

        return arrayMove(prev, activeModuleIndex, overModuleIndex);
      };

      if (mode === Mode.Modules) setModules(swapElements);
      if (mode === Mode.Products) setProducts(swapElements);
      if (mode === Mode.Skills) setSkills(swapElements);
    }

    const isOverADiscipline = over.data.current?.type === "Discipline";

    if (isActiveModule && isOverADiscipline) {
      const elementMoveToBlock = (prev: DisciplineElement[]) => {
        const activeModuleIndex = prev.findIndex(
          (e) => e.dndId === activeModuleId
        );

        if (
          prev
            .filter((e) => e.disciplineId === Number(overModuleId))
            .some(
              (e) =>
                e.id === prev[activeModuleIndex].id &&
                e.dndId !== prev[activeModuleIndex].dndId
            )
        )
          return prev;

        prev[activeModuleIndex].disciplineId = Number(overModuleId);

        return arrayMove(prev, activeModuleIndex, activeModuleIndex);
      };

      if (mode === Mode.Modules) setModules(elementMoveToBlock);
      if (mode === Mode.Products) setProducts(elementMoveToBlock);
      if (mode === Mode.Skills) setSkills(elementMoveToBlock);
    }
  };

  const sensor = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const deleteElement = (dndElementId: number) => {
    if (mode === Mode.Modules) {
      setModules((prev) => {
        return prev.filter((e) => e.dndId !== dndElementId);
      });
    }

    if (mode === Mode.Skills) {
      setSkills((prev) => {
        return prev.filter((e) => e.dndId !== dndElementId);
      });
    }

    if (mode === Mode.Products) {
      setProducts((prev) => {
        return prev.filter((e) => e.dndId !== dndElementId);
      });
    }
  };

  const disciplineTitleChange = (changedTitle: string) => {
    const newTitleDisciplines = disciplines.map((e) =>
      e.id === disciplineIdToChangeTitle ? { ...e, name: changedTitle } : e
    );
    setDisciplines(newTitleDisciplines);
  };

  const disciplineDescriptionChange = (
    disciplineId: number,
    changedDescription: string
  ) => {
    const newDescriptionDisciplines = disciplines.map((e) =>
      e.id === disciplineId
        ? { ...e, short_description: changedDescription }
        : e
    );
    setDisciplines(newDescriptionDisciplines);
  };

  const remove = (id?: number) => {
    const disciplineId = id ? id : disciplineIdToChangeTitle;

    setModules((prev) => {
      return prev.filter((e) => e.disciplineId !== disciplineId);
    });
    setProducts((prev) => {
      return prev.filter((e) => e.disciplineId !== disciplineId);
    });
    setSkills((prev) => {
      return prev.filter((e) => e.disciplineId !== disciplineId);
    });

    setDisciplines((prev) => {
      return prev.filter((e) => e.id !== disciplineId);
    });
  };

  const removeDiscipline = () => {
    if (!disciplineIdToModal) return;

    remove(disciplineIdToModal);

    setDisciplineIdToModal(undefined);
  };

  const deleteDiscipline = () => {
    if (!disciplineIdToModal) return;

    fetchDisciplineDelete(api, disciplineIdToModal)
      .then(() => {
        remove(disciplineIdToModal);
        setDisciplineIdToModal(undefined);
        addMessage("Дисциплина успешно удалена.", true);
      })
      .catch((e: AxiosError<{ detail: { linked_curriculums: string[] } }>) => {
        const error = e.response?.data?.detail.linked_curriculums as string[];
        addMessage(
          "Дисциплина не может быть удалена, так как она связана с учебными планами: " +
            error.join(", "),
          false
        );

        setDisciplineIdToModal(undefined);
      });
  };

  const saveDisciplines = () => {
    const disciplinesToSave: TypeFetchDiscipline[] = disciplines.map(
      (discipline) => {
        return {
          ...discipline,
          skills: skills.filter((e) => e.disciplineId == discipline.id),
          products: products.filter((e) => e.disciplineId == discipline.id),
          modules: modules
            .filter((e) => e.disciplineId === discipline.id)
            .map((e, index) => {
              return { position: index, module: e };
            }),
        };
      }
    );

    addMessage("Изменения успешно сохранены", true);

    disciplinesToSave.map((e) =>
      fetchDisciplineUpdate(api, e).catch(() => {
        addMessage("При сохранении проихошла ошибка", false);
      })
    );
  };

  const confirmModes = (confirm: Confirm) => {
    if (confirm === Confirm.Delete) {
      return {
        text: "Вы уверены что хотите безвозвратно удалить дисциплину?",
        confirmFunc: deleteDiscipline,
      };
    } else {
      return {
        text: "Вы уверены что хотите убрать дисциплину? Несохраненные данные пропадут.",
        confirmFunc: removeDiscipline,
      };
    }
  };

  const addMessage = (text: string, success: boolean) => {
    setMessage({ text, success });
  };

  const clearMessage = () => {
    setMessage(null);
  };

  const elements =
    mode === Mode.Modules ? modules : mode === Mode.Skills ? skills : products;

  return (
    <div className="moduleContent">
      <div className="pageName">Конструктор дисциплин</div>
      <div className="disciplineAddBlock">
        {disciplineIdToCreateElement ? (
          <>
            {mode === Mode.Modules && (
              <div>
                <label className="searchConstructorText-field__label">
                  Введите название модуля
                </label>
                <div style={{ width: "500px" }}>
                  <SearchConstructor
                    key={1}
                    blockName="модуля"
                    useDataGet={useModuleList}
                    setSelectedElement={addElement}
                    width={500}
                    onBlur={onBlurSearch}
                    autoFocus={true}
                    createText=""
                  />
                </div>
              </div>
            )}

            {mode === Mode.Products && (
              <div>
                <label className="searchConstructorText-field__label">
                  Введите название продукта
                </label>
                <div style={{ width: "500px" }}>
                  <SearchConstructor
                    key={1}
                    blockName="продукта"
                    useDataGet={useProductList}
                    setSelectedElement={addElement}
                    width={500}
                    onBlur={onBlurSearch}
                    autoFocus={true}
                    createNewF={createNewProduct}
                    createText="+ Создать новый продукт с введенным названием"
                  />
                </div>
              </div>
            )}

            {mode === Mode.Skills && (
              <div>
                <label className="searchConstructorText-field__label">
                  Введите название навыка
                </label>
                <div style={{ width: "500px" }}>
                  <SearchConstructor
                    key={1}
                    blockName="навыка"
                    useDataGet={useSkillList}
                    setSelectedElement={addElement}
                    width={500}
                    onBlur={onBlurSearch}
                    autoFocus={true}
                    createNewF={createNewSkill}
                    createText="+ Создать новый навык с введенным названием"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div>
            <label className="searchConstructorText-field__label">
              Введите название дисциплины
            </label>
            <div style={{ width: "500px" }}>
              <SearchConstructor
                key={2}
                blockName="дисциплины"
                useDataGet={useDisciplineList}
                setSelectedElement={addDiscipline}
                width={500}
                createNewF={createNewDiscipline}
                createText="+ Создать новую дисциплину с введенным названием"
              />
            </div>
          </div>
        )}

        <div style={{ marginLeft: "30px" }}>
          <label className="searchConstructorText-field__label">
            Режим отображения
          </label>
          <Combobox mode={mode} setMode={setMode} />
        </div>

        <div style={{ marginLeft: "30px" }}>
          <label className="searchConstructorText-field__label">
            Копировать при перетаскивании
          </label>
          <label className="toggler-wrapper style-21">
            <input
              type="checkbox"
              checked={isCopyElement}
              onChange={(e) => setIsCopyElement(e.target.checked)}
            />
            <div className="toggler-slider">
              <div className="toggler-knob"></div>
            </div>
          </label>
        </div>

        {disciplineIdToChangeTitle && (
          <>
            <div style={{ marginLeft: "30px", marginTop: "24px" }}>
              <button
                onClick={() => {
                  setModalConfirmMode(Confirm.Remove);
                  setDisciplineIdToModal(disciplineIdToChangeTitle);
                }}
                className="DisciplineButton"
              >
                Убрать дисциплину
              </button>
            </div>

            <div style={{ marginLeft: "30px", marginTop: "24px" }}>
              <button
                onClick={() => {
                  setModalConfirmMode(Confirm.Delete);
                  setDisciplineIdToModal(disciplineIdToChangeTitle);
                }}
                className="DisciplineButton"
              >
                Удалить дисциплину
              </button>
            </div>
          </>
        )}

        <div style={{ marginLeft: "30px", marginTop: "24px" }}>
          <button
            onClick={() => saveDisciplines()}
            className="DisciplineButton"
          >
            Сохранить все
          </button>
        </div>
      </div>
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensor}
        onDragOver={onDragOver}
      >
        <div className="disciplineBlocks">
          <SortableContext items={disciplinesId}>
            {disciplines.map((elem) => (
              <DisciplineBlock
                key={elem.id}
                discipline={elem}
                disciplineIdToChangeTitle={disciplineIdToChangeTitle}
                setDisciplineIdToChangeTitle={setDisciplineIdToChangeTitle}
                setDisciplineIdToCreateElement={setDisciplineIdToCreateElement}
                elements={elements.filter((e) => e.disciplineId === elem.id)}
                deleteElement={deleteElement}
                disciplineTitleChange={disciplineTitleChange}
                mode={mode}
                disciplineDescriptionChange={disciplineDescriptionChange}
              />
            ))}
          </SortableContext>
        </div>
        {createPortal(
          <DragOverlay>
            {draggableDiscipline && (
              <DisciplineBlock
                discipline={draggableDiscipline}
                disciplineIdToChangeTitle={disciplineIdToChangeTitle}
                setDisciplineIdToChangeTitle={setDisciplineIdToChangeTitle}
                setDisciplineIdToCreateElement={setDisciplineIdToCreateElement}
                elements={elements.filter(
                  (e) => e.disciplineId === draggableDiscipline.id
                )}
                deleteElement={deleteElement}
                disciplineTitleChange={disciplineTitleChange}
                mode={mode}
                disciplineDescriptionChange={disciplineDescriptionChange}
              />
            )}
            {draggableElement && (
              <DisciplineBlockElement
                element={draggableElement}
                deleteElement={deleteElement}
                isOverlay={true}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      <ModalConfirm
        isOpen={disciplineIdToModal !== undefined}
        setIsOpen={setDisciplineIdToModal}
        confirmFunc={confirmModes(modalConfirmMode).confirmFunc}
        text={confirmModes(modalConfirmMode).text}
      />
      {message && <InfoMessage message={message} clear={clearMessage} />}
    </div>
  );
};

export default DisciplineConstructor;
