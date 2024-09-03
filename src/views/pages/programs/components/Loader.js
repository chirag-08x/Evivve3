import React, { useState, useEffect } from 'react';
import Loaderimage from "../../../../assets/images/programs/abstract_brush1.png";
import activation from "../../../../assets/images/programs/activation.svg";
import experiment from "../../../../assets/images/programs/experiment.svg";
import reflection from "../../../../assets/images/programs/reflection.svg";
import learning from "../../../../assets/images/programs/learning.svg";
import palnning from "../../../../assets/images/programs/palnning.svg";
import styled from "@emotion/styled";


const LoaderContainer = styled("div")`
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(${Loaderimage});
  background-size: cover;
  background-color:red;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CyclingImages = styled("div")`
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translate(-50%, -50%);
  display: flex;

  z-index:999;
  img {
    width: 220px; /* Adjust size as needed */
    height: 220px; /* Adjust size as needed */
    opacity: 0;
    position: absolute;
    animation: fadeInOut 3.5s infinite;
  }


  @keyframes fadeInOut {
    0% { opacity: 0; }
    25% { opacity: 1; }
    75% { opacity: 1; }
    100% { opacity: 0; }
  }
`;


const ImageCycler = () => {
  const images = [activation,experiment, palnning, learning, reflection];
  const imagesText = ["Activation","Experimentation", "Forecasting", "Learning", "Reflection"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);


  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade out

      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true); // Start fade in
      }, 500); // Adjust timing to match your fade duration
    }, 2000); // Total time including fade out and in

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div style={{ display: 'flex', }}>
      <img src={Loaderimage} alt="Loader Background" style={{ left: '51%',top: "58%",transform: 'translate(-50%, -50%)',height:'92%',
           width:'52%', zIndex: '999',position:'absolute' }} />
      {images.map((src, index) => (
        <div style={{display:'flex',flexDirection:'column', zIndex: '999',
          position: 'absolute',
          top: "58%",
          left: '51%',
          width: '20%',
          transform: 'translate(-50%, -50%)',
          opacity: index === currentImageIndex && fade ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',}}>
          <img
          key={index}
          src={src}
          alt={`Cycling Image ${index}`}
          
        />
        <h2 style={{color:"white",textAlign:'center'}}>{imagesText[index]}</h2>
        </div>
        
     
      ))}
    </div>
  );
};

export default ImageCycler;
