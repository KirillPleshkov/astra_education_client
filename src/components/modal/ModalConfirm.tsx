import * as React from "react";
import ReactModal from "react-modal";
import "./styles.css";

interface IModalConfirmProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<number | undefined>>;
  confirmFunc: () => void;
  text: string;
}

const ModalConfirm: React.FunctionComponent<IModalConfirmProps> = ({
  isOpen,
  setIsOpen,
  confirmFunc,
  text,
}) => {
  return (
    <>
      <ReactModal
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(undefined)}
        className="modalConfirmModal"
        shouldFocusAfterRender={false}
        style={{
          overlay: {
            zIndex: 2,
            backgroundColor: "rgba(0, 0, 0, 0)",
          },
        }}
      >
        <div className="modalConfirmModal">
          <div className="modalConfirmModalText">{text}</div>
          <div style={{ display: "flex" }}>
            <button
              className="modalConfirmModalButtonConfirm"
              onClick={() => {
                confirmFunc();
              }}
            >
              Да
            </button>
            <button
              className="modalConfirmModalButtonExit"
              onClick={() => setIsOpen(undefined)}
            >
              Нет
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default ModalConfirm;
