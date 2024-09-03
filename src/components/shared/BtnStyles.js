import styled from "@emotion/styled";

export const PrimaryBtn = styled("button")`
  background: #5b105a;
  border-radius: 8px;
  padding: 10px 18px;
  border: 1px solid #5b105a;
  width: ${(props) => props.width || "127px"};
  margin-left: ${(props) => props.ml};
  margin-right: ${(props) => props.mr};
  margin-top: ${(props) => props.mt};
  margin-bottom: ${(props) => props.mb};
  font-size: 1rem;
  font-family: Inter;
  font-weight: 800;
  color: ${(props) => props.color || "#ffffff"};
  cursor: pointer;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  svg {
    stroke: ${(props) => props.color || "#ffffff"};
  }

  &:hover {
    background: #341a5a;
    border: 1px solid #341a5a;
  }

  &:disabled {
    background: rgba(0, 0, 0, 0.3);
    border: none;
    cursor: auto;
  }
`;
export const PrimaryMenuBtn = styled("button")`
  background: #5b105a;
  border-radius: 8px;
  padding: 10px 18px;
  border: none;
  width: ${(props) => props.width || "127px"};
  margin-left: ${(props) => props.ml};
  margin-right: ${(props) => props.mr};
  margin-top: ${(props) => props.mt};
  margin-bottom: ${(props) => props.mb};
  font-size: 1rem;
  font-family: Inter;
  font-weight: 800;
  color: ${(props) => props.color || "#ffffff"};
  cursor: pointer;
  display: flex;
  flex-direction:row-reverse;
  gap: 2px;
  align-items: center;
  justify-content: space-between;

  svg {
    stroke: ${(props) => props.color || "#ffffff"};
  }

  &:hover {
    background: #341a5a;
   
  }

  &:disabled {
    background: rgba(0, 0, 0, 0.3);
    border: none;
    cursor: auto;
  }
`;

export const PrimaryBtn2 = styled(PrimaryBtn)`
  background: #fff;
  color: #5b105a;

  &:hover {
    background: #fff;
    border: 1px solid #d0d5dd;
    color: #e8c48f;
  }
`;

export const SecondaryBtn = styled(PrimaryBtn)`
  background: #e8c48f;
  color: ${(props) => props.color || "#373a36"};
  border: 1px solid #e8c48f;

  svg {
    stroke: ${(props) => props.color || "#373a36"};
  }

  &:hover {
    background: #cb9544;
    border: 1px solid #cb9544;
  }
`;

export const SecondaryGrayBtn = styled(PrimaryBtn)`
  background: transparent;
  border: 1px solid #d0d5dd;
  color: ${(props) => props.color || "#373A36"};
  svg {
    stroke: ${(props) => props.color || "#373A36"};
  }
  &:hover {
    background: transparent;
    color: #e8c48f;
    border: 1px solid #d0d5dd;

    svg {
      stroke: #e8c48f;
    }
  }
`;

export const AddNodeBtnStyles = {
  background: "#5b105a",
  color: "#fff",
  border: "none",
  m: 0,
  p: 0.5,
  fontWeight: 700,
  borderRadius: "50%",
  minWidth: "auto",
  ":hover": {
    background: "#341a5a",
  },
};
