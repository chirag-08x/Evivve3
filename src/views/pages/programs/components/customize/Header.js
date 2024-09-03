import styled from "@emotion/styled";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useSelector } from "react-redux";

const HeaderContainer = styled("header")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  padding: ${(props) => (props.adjustContext ? 0 : "1rem 0 1.5rem 0")};
`;

const HeaderText = styled("p")`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2a3547;
  padding: 0.5rem 0;
  margin: 0;
`;

const InfoContainer = styled("div")`
  display: grid;
  place-items: center;
  position: relative;

  &:hover {
    .info-text {
      display: block;
    }
  }
`;

const InfoText = styled("p")`
  position: absolute;
  width: 20rem;
  top: 1rem;
  right: 0.1px;
  border: 1px solid black;
  font-size: 14px;
  padding: 0.4rem 1rem;
  background: #f5f6f8;
  color: #1e2757;
  border-radius: 0.5rem;
  display: none;
`;

const Header = ({ headerText, headerIcon = false, subText }) => {
  const isAdjustContextDialog = useSelector(
    (state) => state?.programs?.showAdjustContextDialog
  );

  return (
    <HeaderContainer adjustContext={isAdjustContextDialog?.showBtn}>
      <HeaderText>{headerText}</HeaderText>
      {headerIcon && (
        <InfoContainer>
          <InfoOutlinedIcon />

          <InfoText className="info-text">
            {subText
              ? subText
              : `Your game settings are customized to fit your Program and Learner
            Context`}
          </InfoText>
        </InfoContainer>
      )}
    </HeaderContainer>
  );
};

export default Header;
