import styled from "@emotion/styled";

export const CustomizeLabel = styled("label")`
  font-size: 14px;
  font-weight: 600;
  color: #2a3547;
  padding: 0;
  margin-bottom: ${(props) => props.mb};
  margin-top: ${(props) => props.mt};
  margin-left: ${(props) => props.ml};
  margin-right: ${(props) => props.mr};
`;

export const CustomizeWrapper = styled("div")`
  display: grid;
  gap: 1.5rem 0;
  position: relative;
  font-family: Inter;
`;

export const Form = styled("form")`
  display: grid;
  gap: 1.5rem;
`;

export const FormField = styled("div")`
  display: grid;
  gap: 0.5rem;
`;

export const InfoCircle = styled("span")`
  position: relative;

  &:hover {
    div {
      display: block;
    }
  }
`;

export const InfoIconContainer = styled("span")`
  margin: 0;
  padding: 0;
  position: absolute;
  margin-left: 0.5rem;
  margin-top: -0.2rem;
  z-index: 5;
`;

export const ModuleInfoText = styled("div")`
  position: absolute;
  width: 20rem;
  border: 1px solid black;
  font-size: 14px;
  padding: 0.4rem 1rem;
  background: #f5f6f8;
  color: #1e2757;
  border-radius: 0.5rem;
  font-weight: 400;
  left: 1rem;
  display: none;
  z-index: 5;
`;

export const AccordionWrapper = styled("div")`
  border: 1.5px solid #0d2359;
  border-radius: 8px;
  background-color: ${({ open }) => (open ? "#F5F6F8" : "#fff")};
  padding: 0.5rem;
  padding-bottom: ${({ open }) => (open ? "2rem" : "0.5rem")};
  display: grid;
  gap: 1.5rem;
`;

export const AccordionExpandWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0 2rem;
`;

export const Text = styled("p")`
  font-size: 14px;
  color: #2a3547;
  margin: 0;
`;

export const ExpandButton = styled("button")`
  border: none;
  background: none;
  cursor: pointer;
  * {
    font-size: 2.4rem;
  }
`;

export const AccordionInnerWrapper = styled("div")`
  display: grid;
  place-items: center;
  gap: 2rem;
`;
