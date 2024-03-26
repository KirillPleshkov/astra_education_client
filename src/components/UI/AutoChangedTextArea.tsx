import * as React from "react";
import { ChangeEventHandler, TextareaHTMLAttributes, useRef } from "react";

interface IAutoChangedTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  isDropped: boolean;
}

const AutoChangedTextArea: React.FunctionComponent<
  IAutoChangedTextAreaProps
> = ({ isDropped, ...props }) => {
  const textARef = useRef<HTMLTextAreaElement>(null);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const scrollLeft = window.scrollX;

    const scrollTop = window.scrollY;

    e.target.style.height = "0px";
    const scrollHeight =
      e.target.scrollHeight > 60 ? e.target.scrollHeight : 60;
    e.target.style.height = scrollHeight + "px";

    window.scrollTo(scrollLeft, scrollTop);
  };

  React.useEffect(() => {
    if (!textARef || !textARef.current) return;

    textARef.current.style.height = "0px";
    const scrollHeight =
      textARef.current.scrollHeight > 60 ? textARef.current.scrollHeight : 60;
    textARef.current.style.height = scrollHeight + "px";
  }, [textARef]);

  React.useEffect(() => {
    if (!textARef || !textARef.current) return;

    if (isDropped) {
      textARef.current.style.height = "60px";
    } else {
      textARef.current.style.height = "0px";
      const scrollHeight =
        textARef.current.scrollHeight > 60 ? textARef.current.scrollHeight : 60;
      textARef.current.style.height = scrollHeight + "px";
    }
  }, [isDropped]);

  return (
    <textarea
      {...props}
      ref={textARef}
      style={{ resize: "none", minHeight: "60px" }}
      onInput={handleChange}
    />
  );
};

export default AutoChangedTextArea;
