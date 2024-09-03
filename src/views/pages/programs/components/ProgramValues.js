import styled from "@emotion/styled";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const ProgramContainer = styled("div")`
  background-color: #e8c48f;
  border: 1px solid #cb9544;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0 1rem;
  border-radius: 1rem;
  padding: 0 0.4rem;
  color: #101828;
  font-size: 0.875rem;
`;

const ProgramInfo = styled("div")`
  span {
    font-weight: 700;
  }
`;

const ProgramValue = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    color: #676767;
    span {
      color: #016e19;
      font-weight: 700;
      font-size: 1.125rem;
    }
  }

  .arrow-up {
    color: #016e19;
    font-size: 2rem;
  }
`;

const Line = styled("div")`
  width: 2px;
  height: 50%;
  background-color: #5f5f5f;
`;

const ProgramValues = () => {
  return (
    <ProgramContainer>
      <ProgramInfo>
        <p>Omar's Decision Making Program</p>
        <p>
          Current Program Value: <span>$3500</span>
        </p>
      </ProgramInfo>
      <Line className="line"></Line>
      <ProgramValue>
        <p>
          <span>75%</span> <br></br> Value
        </p>
        <ArrowUpwardIcon className="arrow-up" />
      </ProgramValue>
    </ProgramContainer>
  );
};

export default ProgramValues;
