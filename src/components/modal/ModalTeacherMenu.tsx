import * as React from "react";
import ReactModal from "react-modal";
import { Link } from "react-router-dom";
import { typeFetchUser } from "../../api/User/FetchUser";

interface IModalTeacherMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  linguist_roles: typeFetchUser["linguist_roles"];
}

const ModalTeacherMenu: React.FunctionComponent<IModalTeacherMenuProps> = ({
  isOpen,
  setIsOpen,
  linguist_roles,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      className="navModal"
      shouldFocusAfterRender={false}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0)",
        },
      }}
    >
      <ul className="modalUl" onClick={() => setIsOpen(false)}>
        <li className="navElement ">
          <Link
            to={"/teacher_disciplines"}
            className="navElementLink navModalWidth"
          >
            Мои дисциплины
          </Link>
        </li>

        {linguist_roles.some((e) => e[1] === "MODULE_CHANGE") && (
          <li className="navElement">
            <Link
              to={"/module_constructor"}
              className="navElementLink navModalWidth"
            >
              Конструирование модулей
            </Link>
          </li>
        )}

        {linguist_roles.some((e) => e[1] === "DISCIPLINE_CHANGE") && (
          <li className="navElement">
            <Link
              to={"/discipline_constructor"}
              className="navElementLink navModalWidth"
            >
              Конструирование дисциплин
            </Link>
          </li>
        )}

        {linguist_roles.some((e) => e[1] === "CURRICULUM_CHANGE") && (
          <li className="navElement">
            <Link
              to={"/curriculum_constructor"}
              className="navElementLink navModalWidth"
            >
              Конструирование учебных планов
            </Link>
          </li>
        )}
      </ul>
    </ReactModal>
  );
};

export default ModalTeacherMenu;
