import styled from "@emotion/styled";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RoleSelectorDialog } from "./Dialogs";
import { Heading, SubHeading } from "./ProgramStyles";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import { useGetProgramTemplates } from "src/services/programs";
import {
  getTemplates,
  setSelectedTemplate,
} from "src/store/apps/programs/ProgramSlice";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 35px;
  padding-left: 30px;
  padding-right: 30px;
`;

const CardContainer = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Card = styled("div")`
  display: flex;
  position: relative;
  z-index: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: calc(33.33% - 20px); /* 3 cards per row with spacing */
  border-radius: 8px;
  border: 1px solid #eaecf0;
  background: white;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06),
    0px 1px 3px 0px rgba(16, 24, 40, 0.1);

  &:hover {
    & > img {
      opacity: 0.6;
    }
  }

&::before {
  content: '';
  position: absolute;
  top: -1.9px; 
  right: -1.9px;
  bottom: -1.9px;
  left: -1.9px;
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
background:white;
border-radius:5px;
padding:25px 30px
`
const Image = styled("img")`
  width: 100%;
  height: fit-content;
  /* opacity: 0.5; */
  cursor: pointer;
  border-radius:13.75px;
`;

const Description = styled("p")`
  margin: 10px 0 5px 0;
  font-size: 14px;
  color: #555;
  width: 100%;
`;

const Goals = styled("p")`
  margin: 5px 0 10px 0;
  font-size: 14px;
  color: #555;
  width: 100%;
`;

const TemplateSelector = ({ goToNext }) => {
  useGetProgramTemplates();
  const dispatch = useDispatch();
  const templates = useSelector(getTemplates);
  const [roleSelector, setOpenRoleSelector] = useState(false);

  const handleClick = (id) => {
    dispatch(setSelectedTemplate(id));
    setOpenRoleSelector(true);
  };

  return (
    <Container>
      <RoleSelectorDialog
        goToNext={goToNext}
        open={roleSelector}
        setOpen={setOpenRoleSelector}
      />
      <Heading>Quick Start Guide</Heading>
      <SubHeading>
        Used by more than 15,000 players, our pre-built game templates allow you
        to get started in seconds.
      </SubHeading>
      <CardContainer>
        {templates?.length &&
          templates.map((temp) => (
            <Card key={temp.id}>
              <InnerCard>
              <Image
                src={temp.image}
                alt={temp.id}
                onClick={() => handleClick(temp.id)}
              />
              <Description>{temp.description}</Description>
              <Goals>
                <span style={{ fontWeight: "bold" }}>Goals:</span> {temp.goals}
              </Goals>
              <PrimaryBtn
                mt="10px"
                width="100%"
                onClick={() => handleClick(temp.id)}
              >
                {temp.displayName}
              </PrimaryBtn>
              </InnerCard>
            </Card>
          ))}
      </CardContainer>
    </Container>
  );
};

export default TemplateSelector;
