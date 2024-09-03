import styled from "@emotion/styled";

const TextArea = styled("textarea")`
  resize: none;
  padding: 1rem;
  border-radius: 7px;
  font-size: 1rem;
  border: 1px solid #dfe5ef;
  font-weight: 500;
  width: ${(props) => (props.width ? props.width : undefined)};
  font-family: Inter;
  &::placeholder {
    font-size: 14px;
    font-family: Inter;
  }
`;

const TextAreaInput = ({
  value,
  placeholder,
  onChange,
  id,
  name,
  width,
  required,
  readOnly,
  rows = 7,
}) => {
  return (
    <TextArea
      id={id}
      name={name}
      rows={rows}
      placeholder={placeholder}
      value={Array.isArray(value) ? value.join("\n") : value}
      onChange={onChange}
      width={width}
      readOnly={readOnly}
      style={{
        border: required && value.length === 0 ? "1px solid red" : null,
        outline: required && value.length === 0 && "1px solid red",
        outline: readOnly && "none",
        cursor: readOnly && "default",
      }}
    ></TextArea>
  );
};

export default TextAreaInput;
