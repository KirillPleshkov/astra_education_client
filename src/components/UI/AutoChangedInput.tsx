import * as React from "react";

interface IAutoChangedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const AutoChangedInput: React.FunctionComponent<IAutoChangedInputProps> = ({
  ...props
}) => {
  return <input type="text" {...props} />;
};

export default AutoChangedInput;
