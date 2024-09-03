import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import ReactSpeedometer from "react-d3-speedometer";
import { Check, Cross, Elipse_1, Elipse_2, Elipse_3 } from "src/assets/images";
import { setAudio } from "src/store/apps/present/PresentSlice";
import SafeSocketProvider from "src/services/safeSocketProvider";
import { Typography } from "@mui/material";

const ResourceWrapper = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  justify-items: center;
  grid-gap: 1rem;
`;

const wrapper = styled("div")`
  background: #000000a6;
  border: 1px solid #323232;
  box-shadow: 0px 4px 4px 0px #a9a9a940;
  border-radius: 1rem;
`;

const StatusWrapper = styled(wrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ResourceInnerWrapper = styled(wrapper)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  width: 100%;
`;

const ResourceLabel = styled("div")`
  color: #f5f5f5;
  font-size: 1.5rem;
  font-weight: 900;
  text-align: center;
  margin: 0.5rem 0;
`;

const Desc = styled("div")`
  font-family: Inter;
  color: #bdbdbd;
  line-height: 20px;
  letter-spacing: 0em;
`;

const ResourceDesc = styled(Desc)`
  font-weight: 700;
  text-align: left;
  margin-bottom: 0.5rem;
`;

const ImpactDesc = styled("div")`
  font-family: Inter;
  color: #bdbdbd;
  line-height: 20px;
  letter-spacing: 0em;
  font-size: 16px;
  font-weight: 400;
`;

const StatusBarWrapper = styled("div")`
  background: #4a4b7180;
  padding: 0.4rem 4rem;
  border-radius: 0.25rem;
  position: relative;
  margin-bottom: 1.5rem;
  align-items: center;
`;

const StatusBarValue = styled("div")`
  position: absolute;
  top: 0;
  bottom: 0;
  background: #341a5a;
  width: ${({ progressPercentage }) => Math.min(progressPercentage, 100)}%;
  left: 0;
  z-index: 2;
  overflow: hidden;
  transition: width 0.3s linear;
`;

const StatusText = styled("p")`
  color: #000;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
  position: relative;
  z-index: 3;
`;

const SubResourceWrapper = styled("div")`
  flex: 1;
  align-items: center;
  margin: 0 51px !important;
  opacity: ${(props) => (props.disasterEffectDays > 0 ? 1 : 0)};
  flex-direction: column;
`;

const OfferLabel = styled("p")`
  font-family: Inter;
  font-size: 24px;
  font-weight: 900;
  line-height: 20px;
  color: rgba(245, 245, 245, 1);
  margin-top: 16px;
  margin-bottom: 2.5rem;
`;

const OfferDetail = styled("p")`
  font-family: Inter;
  font-size: 20px;
  font-weight: 600;
  line-height: 20px;
  text-align: left;
  color: rgba(189, 189, 189, 1);
  margin-bottom: 1rem;
`;

const Speedometer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  margin-left: 2rem;
  z-index: 500;
`;

const ResourceOrder = styled("div")`
  // flex: 1;
  // align-items: center;
  // margin-left: 2rem;
  grid-column: 2;
`;

const CheckLayout = styled("img")`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const ResourceDetail = styled("p")`
  color: #bdbdbd;
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
`;

const TribeValue = styled("p")`
  font-family: Inter;
  color: #bdbdbd;
  font-size: 32px;
  font-weight: 600;
  line-height: 60px;
  letter-spacing: -0.02em;
  text-align: center;
  margin-top: -1.5rem;
  // margin-left: -0.3rem;
`;

const TribeValueDesc = styled("p")`
  font-family: Inter;
  font-size: 18px;
  font-weight: 600;
  line-height: 20px;
  text-align: center;
  color: #bdbdbd;
  margin-top: -3rem;
  // margin-left: -0.5rem;
`;

const SpeedometerLayout = styled("div")`
  position: relative;
  grid-column: 1;
`;

const SpeedometerContainer = styled("div")`
  position: relative;
  display: inline-block;
`;

const Elipse3Img = styled("img")`
  position: absolute;
  top: 29%;
  left: 25%;
  z-index: 0;
`;

const Elipse2Img = styled("img")`
  position: absolute;
  top: 5%;
  left: 7%;
  height: 80%;
`;

const Elipse1Img = styled("img")`
  position: absolute;
  top: 1%;
  left: 3%;
  height: 100%;
`;

const ResourceStatus = () => {
  const [tribeValue, setTribeValue] = useState(0);
  const [disasterName, setDisasterName] = useState(``);
  const [disasterDuration, setDisasterDuration] = useState(``);
  const [disasterEffectDays, setDisasterEffectDays] = useState(``);
  const [offerFulfillmentCount, setOfferFulfillmentCount] = useState(0);
  const [offerUnfulfilledCount, setOfferUnfulfilledCount] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    SafeSocketProvider.on("redis-data", (data) => {
      setTribeValue(data.tribeValueCount);
      setDisasterName(data.disasterName);
      setDisasterDuration(data.disasterDuration);
      setDisasterEffectDays(data.disasterEffectDays);
      setOfferFulfillmentCount(data.offerFulfilledCount);
      setOfferUnfulfilledCount(data.offerUnfulfilledCount);
    });
    return () => SafeSocketProvider.off("redis-data");
  }, []);

  useEffect(() => {
    setProgressPercentage(
      Math.ceil((disasterEffectDays / (disasterDuration * 7)) * 100)
    );
  }, [disasterEffectDays, disasterDuration]);

  useEffect(() => {
    if (disasterName) {
      let audioUrl;
      switch (disasterName) {
        case "Acid Rain":
          audioUrl =
            "https://d3cyxgc836sqrt.cloudfront.net/audios/Acid_Rain.mp3";
          break;
        case "Acid Storm":
          audioUrl =
            "https://d3cyxgc836sqrt.cloudfront.net/audios/Acid_Storm.mp3";
          break;
        case "Earthquake":
          audioUrl =
            "https://d3cyxgc836sqrt.cloudfront.net/audios/Earthquake.mp3";
          break;
        case "Forest Fire":
          audioUrl =
            "https://d3cyxgc836sqrt.cloudfront.net/audios/Forest_Fire.mp3";
          break;
        case "Volcanic Eruption":
          audioUrl =
            "https://d3cyxgc836sqrt.cloudfront.net/audios/Volcanic_Eruption.mp3";
          break;
        default:
          audioUrl = "https://d3cyxgc836sqrt.cloudfront.net/audios/game.mp3";
      }

      if (audioUrl) {
        setTimeout(() => {
          dispatch(setAudio(audioUrl));
          setTimeout(() => {
            dispatch(
              setAudio("https://d3cyxgc836sqrt.cloudfront.net/audios/game.mp3")
            );
          }, 60000);
        }, 15000);
      }
    }
  }, [disasterName]);

  return (
    <ResourceWrapper>
      <ResourceInnerWrapper>
        <SpeedometerLayout>
          <SpeedometerContainer>
            <Elipse1Img src={Elipse_1} />
            <Elipse2Img src={Elipse_2} />
            <Elipse3Img src={Elipse_3} />
            <Speedometer>
              <ReactSpeedometer
                value={tribeValue}
                minValue={0}
                maxValue={10}
                needleColor="white"
                segments={5}
                segmentColors={[
                  "#B65323",
                  "#E9B42D",
                  "#F3E357",
                  "#93B46E",
                  "#495F31",
                ]}
                ringWidth={10}
                valueTextFontSize={"0px"}
                height={140}
                width={250}
                textColor={"white"}
              />
              <TribeValue>{tribeValue}</TribeValue>
              <TribeValueDesc>Tribe Rep</TribeValueDesc>
            </Speedometer>
          </SpeedometerContainer>
        </SpeedometerLayout>

        <ResourceOrder>
          <OfferLabel>Offer Fulfillment</OfferLabel>
          <OfferDetail>
            <CheckLayout src={Check} />
            Offers Completed:{offerFulfillmentCount}%
          </OfferDetail>
          <OfferDetail>
            <CheckLayout src={Cross} />
            Unfulfilled Offers:{offerUnfulfilledCount}%
          </OfferDetail>
          <ResourceDetail>Tip: Ensure all offers are delivered</ResourceDetail>
        </ResourceOrder>
      </ResourceInnerWrapper>
      <StatusWrapper>
        <ResourceLabel>Notification Center</ResourceLabel>
        {!disasterName && !disasterEffectDays && (
          <Typography variant="h6" color="#bdbdbd" textAlign="center">
            No New Notifications
          </Typography>
        )}
        <SubResourceWrapper disasterEffectDays={disasterEffectDays}>
          <ResourceDesc>Impact Duration</ResourceDesc>
          <StatusBarWrapper>
            <StatusText>
              {disasterName} - {disasterEffectDays} days
            </StatusText>
            <StatusBarValue
              progressPercentage={progressPercentage}
            ></StatusBarValue>
          </StatusBarWrapper>
          <ResourceDesc>Possible Aftermath</ResourceDesc>
          <ImpactDesc>
            Land Inaccessibility | Console Restrictions | Progress Loss
          </ImpactDesc>
        </SubResourceWrapper>
      </StatusWrapper>
    </ResourceWrapper>
  );
};

export default ResourceStatus;
