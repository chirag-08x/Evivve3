import styled from "@emotion/styled";

export const TimerText = styled("span")`
  color: #fff;
  text-align: center;
  font-family: Inter;
  font-size: 96px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
`;

export const HeaderContainer = styled("div")`
  display: flex;
  width: 80%;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
`;

export const HeadingText = styled("span")`
  color: #fff;
  text-align: center;
  text-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-family: Inter;
  font-size: ${(props) => props.size || "48px"};
  font-style: normal;
  font-weight: 700;
  color: #fff;
  font-weight: 800;
  /* text-transform: capitalize; */
`;

export const SubText = styled("span")`
  color: #fff;
  text-align: center;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
  width: 70%;
`;

export const ChevronBtnLeft = styled("button")`
  background: transparent;
  color: white;
  border: none;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  cursor: pointer;
`;
export const ChevronBtnRight = styled(ChevronBtnLeft)`
  left: initial;
  right: 0;
`;

export const IndexCounter = styled("span")`
  position: absolute;
  bottom: 1rem;
  color: white;
  text-decoration: underline;
  left: 50%;
`;
