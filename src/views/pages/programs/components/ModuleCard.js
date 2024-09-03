import styled from "@emotion/styled";
import { PrimaryBtn2 } from "../../../../components/shared/BtnStyles";
import { IconChevronsRight } from "@tabler/icons";
import {
  getSelectedProgram,
  toggleCustomizeDialog,
} from "src/store/apps/programs/ProgramSlice";
import { useDispatch, useSelector } from "react-redux";

const SingleCard = styled("div")`
  transition: all 0.5s ease-in-out;
  border: 1px solid #eaecf0;
  background: white;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06),
    0px 1px 3px 0px rgba(16, 24, 40, 0.1);
  padding:1px;
  border-radius: 10px;
  flex: 0 0 calc(${(props) => (props.isCollapse ? "28.5%" : "33.33%")} - 1.5rem);
  position: relative;
  
  &::before {
  content: '';
  position: absolute;
  top: -1px; 
  right: -1px;
  bottom: -1px;
  left: -1px;
  background:linear-gradient(to right, rgba(119, 76, 159, 0.3), rgba(17, 36, 92, 0.3)) ;
  border-radius: 8px;
  z-index: -1;
}
`;

const InnerCard=styled("div")`
height:100%;
display:flex;
flex-direction:column;
justify-content:space-between;
align-items:center;
gap:0.7rem 0;
background:white;
padding: 1.25rem 1rem;
border-radius:5px;
padding:25px 30px
`
const Heading = styled("h1")`
  color: #2a3547;
  font-size: 24px;
`;

const P = styled("p")`
  text-align: center;
  color: #2a3547;
  font-size: 14px;
  height:80px;
`;

const BtnContainer = styled("div")`
  display: grid;
  gap: 1rem;
  
`;

const ArrowIconContainer = styled("div")`
  color: #5b105a;
  position: absolute;
  top: 50%;
  right: -1.5rem;
`;

const ImgContainer = styled("div")`
  > img {
    object-fit:cover;
  }
`;

const ModuleCard = ({
  currentSlideIdx = 0,
  name,
  description,
  module,
  idx,
  image,
  id,
  owner
}) => {
  const selectedProgram = useSelector(getSelectedProgram);
  const dispatch = useDispatch();
  const { isCollapse } = useSelector((state) => state.customizer);
  // const owner = selectedProgram.owner;

  const handleClick = () => {
    
    dispatch(toggleCustomizeDialog(name));
  };

  return (
    <SingleCard
      isCollapse={isCollapse}
      style={{ transform: `translateX(-${102 * currentSlideIdx}%)` }}
    >
      
      <p style={{left:'8px',borderRadius:'5px',top:'6px',padding:'1px 8px 1px 8px',color:'white',fontWeight:'600',backgroundColor:'#341A5A',position:'absolute'}}>{name==="Activation"?(parseInt(module.la_dur_min)+parseInt(module.la_qad_min)):name==="Forecasting"?module.sp_dur_min:name==="Experimentation"?module.ga_dur_min:name==="Reflection"?module.re_dur_min:name==="Learning"?module.de_dur_min:"--"} : 00</p>
      <InnerCard>
      <Heading>{name}</Heading>
      <ImgContainer>
        <img style={{width:'170px'}} src={image} alt="" />
      </ImgContainer>
      <P>{description}</P>
      <BtnContainer>
        {owner ? (
          <PrimaryBtn2 width="188px" onClick={handleClick}>
            CUSTOMIZE
          </PrimaryBtn2>
        ) : (
          <PrimaryBtn2 width="188px" onClick={handleClick}>
            VIEW
          </PrimaryBtn2>
        )}
      </BtnContainer>
      </InnerCard>

      {idx < selectedProgram.modules.length - 1 && (
        <ArrowIconContainer>
          <IconChevronsRight />
        </ArrowIconContainer>
      )}
    </SingleCard>
  );
};

export default ModuleCard;
