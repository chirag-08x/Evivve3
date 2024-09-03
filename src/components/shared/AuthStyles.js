import styled from "@emotion/styled";
import logo1 from '../../assets/images/backgrounds/1.png'
import logo3 from '../../assets/images/backgrounds/2.png'
import logo2 from '../../assets/images/backgrounds/3.png'

let randomNum=(Math.random() * (5 - 1 + 1)) + 1
export const Wrapper = styled("div")`
  height: 100vh;
  width:100%;
`;

export const GridContainer = styled("div")`
  display: flex;
  flex-direction:row;
  padding-left:8rem;
  align-items:center;
  height: 100%;
 
  background-image: url(${(randomNum)>=1&&(randomNum)<3?logo1:(randomNum)>3&&(randomNum)<=5?logo2:logo3});
  background-size:cover;
  @media (max-width: 768px) {
   justify-content:center;
   padding-left:0px;
  }
`;

export const GridItem1 = styled("div")`
  padding: 1rem 0;
  padding-top:3rem;
  height:95%;
  width:40%;
  border-radius:22.25px;
  display:flex;
  gap:10%;
  flex-direction:column;
  place-items:center;
  overflow-y:auto;
  box-shadow:0px 0px 5px 0px rgb(0,0,0.6,0.4);

  background-color:white;
  @media (max-width: 768px) {
    height:50rem;
    width:23rem;
  }
  ::-webkit-scrollbar {
  display: none;
}

`;

export const GridImage=styled("img")`
 padding: 0 3.5rem;
 height:3.8rem;
  @media (max-width: 768px) {
    height:3.5rem;
    
  }
`;

export const AuthWrapper = styled("div")`

  width: 100%;
  height:100%;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;


`;

export const GridItem2 = styled("div")`
  background: url(${(props) => props.bg});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
`;

export const TimezoneSelect = styled("select")`
  width: 100%;
  padding: 14px 8px;
  border: 2px solid black;
  font-size: 1rem;
`;

export const TextInputField = styled("input")`
  width: 90%;
  padding: 13px 8px;
  border-radius:12px;
  border:none;
  box-shadow:0px 0px 4px 0px rgb(0,0,0.3,0.4);
  font-size: 1rem;
`;
