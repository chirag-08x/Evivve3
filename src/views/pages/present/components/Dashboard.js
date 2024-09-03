import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  DoughnutChart,
  ColumnChart,
  BarChart,
  PieChart,
  RadialbarChart,
} from "src/views/charts";
import { Background, Land_Ownership, Movilennium_Img } from "src/assets/images";
import ResourceStatus from "./ResourceStatus";
import SafeSocketProvider from "src/services/safeSocketProvider";

const Wrapper = styled("div")`
  width: 100%;
  margin: 0 auto;
  padding: 0 3rem;
  @media (max-width: 1400px) {
    overflow-y: auto;
  }
`;
const VideoWrapper = styled("div")`
  
  margin: 0px;
  padding: 0px;
 
`;

const ChartWrapper = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1rem;
  justify-items: center;
  justify-content: space-between;
  align-items: flex-end;
`;

const ChartContainer = styled("div")`
  * {
    padding: 0 !important;
  }
  background: #000000a6;
  border: 1px solid #323232;
  box-shadow: 0px 4px 4px 0px #a9a9a940;
  border-radius: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DoughnutChartWrapper = styled(ChartContainer)`
width: 100%;
`;

const ColumnChartWrapper = styled(ChartContainer)`
width: 100%;
`;

const PieChartWrapper = styled(ChartContainer)`
width: 100%;
`;

const StyledBarChart = styled(BarChart)`
  // width: 178px;
  // height: 281px;
  // top: 162px;
  // margin-top: 200px;
  // left: 489px;
  // gap: 0px;
  // border-radius: 15px 0px 0px 0px;
  // border: 1px 0px 0px 0px;
  // color: #fff;
  background: #000000a6;
  border: 1px solid #323232;
  box-shadow: 0px 4px 4px 0px #a9a9a940;
  border-radius: 1rem;
`;

const CROBCredits = styled("div")`
  flex-direction: column;
  margin: 1rem;
`;

const Account = styled("div")`
  margin-left: 10px;
  color: #cb9544;
  display: flex;
  align-items: center;
  text-align: center;
  border: 1px solid #323232;
  box-shadow: 0px 4px 4px 0px #a9a9a940;
  background: #000000a6;
  border-radius: 1rem;
`;

const MovilenniumsAccount = styled("div")`
  margin-left: 10px;
  color: #cb9544;
  background: #000000a6;
  display: flex;
  align-items: center;
  border: 1px solid #323232;
  box-shadow: 0px 4px 4px 0px #a9a9a940;
  border-radius: 1rem;
  flex-direction: column;
  margin-bottom: 1rem;
  height: ${(props) => (props.creditCount < 1 ? "100%" : "unset")};
`;

const TribeAccount = styled("div")`
  margin-left: 10px;
  color: #cb9544;
  display: flex;
  align-items: center;
  text-align: center;
  border: 1px solid #323232;
  box-shadow: 0px 4px 4px 0px #a9a9a940;
  background: #000000a6;
  border-radius: 1rem;
  flex-direction: row;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 1fr;
  opacity: ${(props) => (props.creditCount < 1 ? 0 : 1)};
  width: 95%;
`;

const ChartCredit = styled("div")`
  display: flex;
  flex-direction: row;
`;

const ChartLabel = styled("p")`
  color: #f5f5f5;
  font-size: 1.5rem;
  font-weight: 900;
  text-align: center;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
`;

const ImpactDesc = styled("div")`
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  color: #bdbdbd;
  margin: 1rem 1.25rem;
`;

const EvivveGenomeExperimentLabel = styled(ChartLabel)`
  color: #cb9544;
`;

const MovilenniumTitle = styled("div")`
  font-family: Inter;
  font-size: 20px;
  font-weight: 900;
  line-height: 20px;
  text-align: center;
  margin-top: 1rem;
`;

const MovilenniumDetails = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${props => (props.creditCount < 1 ? '100%' : 'unset')};
`;

const MovilenniumNumber = styled("div")`
  font-family: Inter;
  font-size: 64px;
  font-weight: 600;
  line-height: 60px;
  letter-spacing: -0.02em;
  text-align: center;
`;

const MovilenniumQuality = styled("p")`
  margin-top: -0.5rem;
  font-family: Inter;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
`;

const CurrentCredit = styled("p")`
  font-family: Inter;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 60px;
  letter-spacing: -0.02em;
  text-align: center;
  margin: 24px 0;
`;

const TitleQualityWrapper = styled("div")``;

const TribeTitle = styled("div")`
  font-family: Inter;
  font-size: 20px;
  font-weight: 900;
  line-height: 20px;
  text-align: left;
  margin-top: -14px;
  margin-left: 14px;
`;

const TribeQuality = styled("div")`
  font-family: Inter;
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
`;

const ResourceAssetImg = styled("img")`
  z-index: 0;
  position: relative;
`;

const LandOwnerDetail = styled("span")`
  // width: 30px;
  // height: 60px;
  position: absolute;
  font-family: Inter;
  font-size: 24px;
  font-weight: 600;
  line-height: 60px;
  letter-spacing: -0.02em;
  text-align: center;
  color: #bdbdbd;
  display: flex;
  z-index: 3;
`;

const LandOwnershipWrapper = styled("div")`
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  position: relative;
`;
const Video = styled("video")`
 display:flex;
  align-items: center;
  justify-content: center;
`;

const MovilenniumImg = styled("img")``;

const Radial = styled("div")`
  position: relative;
`;

const RadialImg = styled("img")`
  position: absolute;
  z-index: -5;
  width: 149px;
  height: 150px;
  left: 3.23rem;
  top: 2.4rem;
`;

const StyledRadialbarChart = styled(RadialbarChart)`
  position: relative;
  z-index: 1;
`;

const getColorByQuality = (quality) => {
  switch (quality.toLowerCase()) {
    case "poor":
      return "#7F3A18";
    case "average":
      return "#FFD700";
    case "good":
      return "#90EE90";
    case "excellent":
      return "#008000";
    default:
      return "#bdbdbd";
  }
};

const Dashboard = () => {
  const [creditCount, setCreditCount] = useState(0);
  const [landOwnership, setLandOwnership] = useState(0);
  const [productQuality, setProductQuality] = useState("");
  const [mov, setMov] = useState(0);
  const [gameEndVideo, setGameEndVideo] = useState("");

  useEffect(() => {

    SafeSocketProvider.on("game-over",(data)=>{
      console.log(data,"GAMEOVER")
      if(data.result==="loss")
      {
         setGameEndVideo("https://d3cyxgc836sqrt.cloudfront.net/videos/methane.mp4")  
      }
      else if(data.result==="won")
      {
        setGameEndVideo("https://d3cyxgc836sqrt.cloudfront.net/videos/victory.mp4")
      }
    })

    SafeSocketProvider.on("redis-data", (data) => {
      console.log(data,"REDISS")
      setCreditCount(data.creditsCount);
      setLandOwnership(data.landOwnership);
      setProductQuality(data.productQuality);
      setMov(data.movCount);
    });

    SafeSocketProvider.on("limit-reached", (data) => {
        if (data.player)
            alert(`Dry run player cap reached. Player: "${data.player}" denied connection.`);
        else
            alert(`Dry run player cap reached. A player was denied connection.`);
    });

    return () => {
        SafeSocketProvider.off("game-over");
        SafeSocketProvider.off("redis-data");
        SafeSocketProvider.off("limit-reached");
    }
  }, []);

  const handleVideoEnd = () => {
    setGameEndVideo(""); // Clear the video source to remove the video
  };

  return (
    <>
      {gameEndVideo?
        <Video onEnded={()=>handleVideoEnd()}  src={gameEndVideo} autoPlay={true} loop={false}/>      
      :
      <Wrapper>
      <ChartWrapper>
        <DoughnutChartWrapper>
          <ChartLabel>Time to Evolve</ChartLabel>
          <Radial>
            <RadialImg src={Background} alt="Background" />
            <StyledRadialbarChart />
          </Radial>
          <ImpactDesc>before Earth becomes a methane planet</ImpactDesc>
        </DoughnutChartWrapper>
        <ColumnChartWrapper>
          <EvivveGenomeExperimentLabel>
            Evivve Genome Experiment
          </EvivveGenomeExperimentLabel>
          <ChartCredit>
              <StyledBarChart />
            <CROBCredits>
              <MovilenniumsAccount creditCount={creditCount}>
                <MovilenniumTitle>Movilennium</MovilenniumTitle>
                <MovilenniumDetails creditCount={creditCount}>
                  <MovilenniumNumber>{mov}</MovilenniumNumber>
                  <MovilenniumImg src={Movilennium_Img} alt="" />
                </MovilenniumDetails>
                <MovilenniumQuality>
                  MV Quality:{" "}
                  <span style={{ color: getColorByQuality(productQuality) }}>
                    {productQuality}
                  </span>
                </MovilenniumQuality>
              </MovilenniumsAccount>
              <TribeAccount creditCount={creditCount}>
                <TitleQualityWrapper>
                  <TribeTitle>Tribe Account</TribeTitle>
                  <TribeQuality>1500cr = 1MV</TribeQuality>
                </TitleQualityWrapper>
                <CurrentCredit>{creditCount} cr</CurrentCredit>
              </TribeAccount>
            </CROBCredits>
          </ChartCredit>
        </ColumnChartWrapper>
        <PieChartWrapper>
          <ChartLabel>Land Ownership</ChartLabel>
          <LandOwnershipWrapper>
            <ResourceAssetImg src={Land_Ownership} alt="" />
            <LandOwnerDetail>{landOwnership}%</LandOwnerDetail>
          </LandOwnershipWrapper>
          <ImpactDesc>land owned by your tribe</ImpactDesc>
        </PieChartWrapper>
      </ChartWrapper>
      <ResourceStatus />
      </Wrapper>
      }
    </>
  );
};

export default Dashboard;
