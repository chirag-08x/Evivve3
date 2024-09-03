import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styled from "@emotion/styled";
import { useState,useRef, useEffect } from "react";
import ModuleCard from "./ModuleCard";
import { useSelector } from "react-redux";
import { getSelectedProgram } from "src/store/apps/programs/ProgramSlice";
import { Input } from "@mui/material";

const CardsContainer = styled("div")`
  margin-top: 1.6rem;
  position: relative;

  .left {
    top: 50%;
    left: 0;
  }
  .right {
    top: 50%;
    right: 0;
  }
`;

const SlideBtn = styled("button")`
  position: absolute;
  border: none;
  background: none;
  background-color: #341a5a;
  color: white;
  border-radius: 50%;
  display: grid;
  place-items: center;
  z-index: 11;
  * {
    font-size: 2.25rem;
  }
`;

const CardsWrapper = styled("div")`
  display: flex;
  gap: 1.5rem;
  overflow: hidden;
  padding: 0 1rem;
`;

const ProgramCardsSlider = ({ owner }) => {
  const selectedProgram = useSelector(getSelectedProgram);
  // const owner = (useSelector(getSelectedProgram)).owner;
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const scrollRefLeft=useRef(null)
  const scrollRefRight=useRef(null)
  const handleSlider = (type) => {
    if (type === "forward") {
      setCurrentSlideIdx((prev) => prev + 1);
    } else if (type === "backward") {
      setCurrentSlideIdx((prev) => prev - 1);
    }
  };
   function handleKeyUp(event) {
      switch (event.key) {
        case "ArrowLeft":
          if(document.activeElement===document.getElementsByTagName('body')[0])
          scrollRefLeft?.current?.click()
         
          break;
        case "ArrowRight":
          if(document.activeElement===document.getElementsByTagName('body')[0])
          scrollRefRight?.current?.click()
          break;
      }
    }
    
  let ele = document.activeElement

  useEffect(()=>{
   
    if(ele!==document.getElementsByTagName('body')[0])
    {
        ele.removeEventListener('keyup', handleKeyUp)
    }
    else
    {
        ele.addEventListener('keyup', handleKeyUp)
    }
    
     
  },[ele])

 
 
   
  
  

  return (
    <CardsContainer>
      {currentSlideIdx >= 1 && (
        <SlideBtn tabIndex={0}  ref={scrollRefLeft} className="left" onClick={() => handleSlider("backward")}>
          <KeyboardArrowLeftIcon />
        </SlideBtn>
      )}

      {currentSlideIdx < selectedProgram.modules.length - 3 && (
        <SlideBtn tabIndex={0}  ref={scrollRefRight} className="right" onClick={() => handleSlider("forward")}>
          <KeyboardArrowRightIcon />
        </SlideBtn>
      )}

      <CardsWrapper>
        {selectedProgram?.modules?.map(
          ({ name, description, image, id }, idx) => {
            return (
              <ModuleCard
                currentSlideIdx={currentSlideIdx}
                name={name}
                description={description}
                image={image}
                module={selectedProgram?.modules[idx]}
                id={id}
                idx={idx}
                key={idx}
                owner={owner}
              />
            );
          }
        )}
      </CardsWrapper>
    </CardsContainer>
  );
};

export default ProgramCardsSlider;
