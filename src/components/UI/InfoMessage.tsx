import * as React from "react";
import "./styles.css";
import { ReactComponent as Cross } from "../../images/Cross.svg";

interface IInfoMessageProps {
  message: string;
  clear: () => void;
  success: boolean;
}

const InfoMessage: React.FunctionComponent<IInfoMessageProps> = ({
  success,
  message,
  clear,
}) => {
  return (
    <div
      className={`infoMessageCard ${success ? "infoMessageSuccess" : "infoMessageError"}`}
    >
      <button className="infoMessageCrossButton" onClick={() => clear()}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 18 18"
          fill={success ? "#98c79b" : "#de5f5f"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.0543 14.9674C17.6413 15.5543 17.6413 16.4674 17.0543 17.0543C16.7609 17.3478 16.4022 17.4783 16.0109 17.4783C15.6196 17.4783 15.2609 17.3478 14.9674 17.0543L9 11.087L3.03261 17.0543C2.73913 17.3478 2.38043 17.4783 1.98913 17.4783C1.59782 17.4783 1.23913 17.3478 0.94565 17.0543C0.358693 16.4674 0.358693 15.5543 0.94565 14.9674L6.91304 9L0.94565 3.03261C0.358693 2.44565 0.358693 1.53261 0.94565 0.94565C1.53261 0.358693 2.44565 0.358693 3.03261 0.94565L9 6.91304L14.9674 0.94565C15.5543 0.358693 16.4674 0.358693 17.0543 0.94565C17.6413 1.53261 17.6413 2.44565 17.0543 3.03261L11.087 9L17.0543 14.9674Z" />
        </svg>
      </button>
      <div className="infoMessageText">{message}</div>
    </div>
  );
};

export default InfoMessage;
