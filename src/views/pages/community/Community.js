import styled from "@emotion/styled";
import { Box, Button, Typography } from "@mui/material";
import PageContainer from "src/components/container/PageContainer";
import { PrimaryBtn, PrimaryBtn2 } from "src/components/shared/BtnStyles";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useState } from "react";
import { CustomDialog } from "../programs/components/Dialogs";
import { useNavigate } from "react-router";
import {
  Certification,
  CocaEvivve,
  CommHuddle,
  CommMasterclass,
  PlayEvivve,
  Support,
  WhatIsEvivve,
  WhatsAppGrp,
  WhatsAppQR,
  CommunitySpace,
} from "src/assets/images";

const GridWrapper = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px 30px;
  margin-bottom: 1rem;
`;

const GridItem = styled("div")`
  height: 340px;
  border: 3px solid #eaecf0;
  border-radius: 5px;
  padding: 1.5rem;
  display: grid;
  place-items: center;
  position: relative;
`;

const Img = styled("img")`
  display: block;
  width: 200px;
  object-fit: cover;
  margin-top: 10px;
  border-radius: 6px;
`;

const Title = styled(Typography)`
  text-align: center;
  line-height: 1.2;
  font-weight: 600;
`;

const Subtitle = styled(Typography)`
  text-align: center;
  line-height: 1.2;
  font-size: 14px;
  color: #1c1e1b;
`;

const BtnIndicator = styled(PrimaryBtn)`
  font-size: 12px;
  width: 100px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 4px;
  position: absolute;
  top: 4px;
  right: 4px;
  font-weight: 500;
`;

const Btn = styled(PrimaryBtn2)`
  align-self: flex-end;
  width: 188px;
`;

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  image: "https://img.icons8.com/?size=100&id=85088&format=png&color=000000",
  dotsOptions: {
    color: "#000",
    type: "rounded",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 2,
  },
});

const CommunityPage = () => {
  const [openCommunityDialog, setOpenCommunityDialog] = useState(false);
  const [url, setUrl] = useState(
    "https://chat.whatsapp.com/FV623VVuVy37PX5FXj1a0i"
  );
  const [qrImage, setQrImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    qrCode.update({
      data: url,
    });
    generateQrCode();
  }, [url]);

  const generateQrCode = async () => {
    const dataUrl = await qrCode.getRawData("png");
    setQrImage(URL.createObjectURL(new Blob([dataUrl])));
  };

  return (
    <>
      <PageContainer title="Community" description="Evivve Community">
        <Typography variant="h5" pb={5} pt={3}>
          Community
        </Typography>

        <Box px={5}>
          <GridWrapper>
            <GridItem>
              <BtnIndicator>LEARN</BtnIndicator>
              <Img src={WhatIsEvivve} alt="" />
              <Title variant="h6">What is Evivve?</Title>
              <Subtitle variant="body1">
                Discover Evivve and how you can gain team insights!
              </Subtitle>
              <Btn>ASK NOW</Btn>
            </GridItem>

            <GridItem>
              <BtnIndicator>LEARN</BtnIndicator>
              <Img src={Certification} alt="" />

              <Title variant="h6">Increase your ROI</Title>
              <Subtitle variant="body1">
                Access Evivve Facilitation opportunities and run Evivve like a
                Pro!
              </Subtitle>
              <Btn
                onClick={() =>
                  window.open(
                    "https://share.hsforms.com/1U5vreA8UTgWkYVCaSiHkEg47ybq",
                    "_blank"
                  )
                }
              >
                DROP INTEREST
              </Btn>
            </GridItem>

            <GridItem>
              <BtnIndicator>EVENT</BtnIndicator>
              <Img src={PlayEvivve} alt="" />
              <Title variant="h6">Upcoming Live Evivve Games</Title>
              <Subtitle variant="body1">
                Attend our next game with Mohsin Memon and network with industry
                peers!
              </Subtitle>
              <Btn
                onClick={() =>
                  window.open(
                    "https://evivve.com/play-live/?utm_source=playevivve&utm_medium=website&utm_campaign=ctabutton",
                    "_blank"
                  )
                }
              >
                PLAY EVIVVE
              </Btn>
            </GridItem>

            <GridItem>
              <BtnIndicator>CONNECT</BtnIndicator>
              <Img src={WhatsAppGrp} alt="Facilitator" />
              <Title variant="h6">Join our What’s App Community!</Title>
              <Subtitle variant="body1">
                Engage, collaborate, and connect with like-minded facilitators
                worldwide.
              </Subtitle>
              <Btn onClick={() => setOpenCommunityDialog(true)}>CONNECT</Btn>
            </GridItem>
          </GridWrapper>

          <GridWrapper style={{ marginTop: "2.5rem" }}>
            <GridItem>
              <BtnIndicator>LEARN</BtnIndicator>
              <Img src={CommunitySpace} alt="Community Space" />
              <Title variant="h6">Community Space</Title>
              <Subtitle variant="body1">
                Check out our awesome community space and interact with each
                other
              </Subtitle>
              <Btn onClick={() => navigate("/community-space")}>JOIN</Btn>
            </GridItem>

            <GridItem>
              <BtnIndicator>EVENT</BtnIndicator>
              <Img src={CocaEvivve} alt="Community Space" />
              <Title variant="h6">Let the games begin!</Title>
              <Subtitle variant="body1">
                Find out what Rashmi, Sr Director of Global Talent at Coca-Cola
                has to say about Evivve.
              </Subtitle>
              <Btn
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/posts/rashmisharma2_1biggrowthfest-collaborationcup-greatthings-activity-7115642008118968321-th1v/?utm_source=share&utm_medium=member_desktop",
                    "_blank"
                  )
                }
              >
                READ
              </Btn>
            </GridItem>

            <GridItem>
              <BtnIndicator>LEARN</BtnIndicator>
              <Img src={CommMasterclass} alt="Evivve Meet" />
              <Title variant="h6">The importance of Practice Spaces</Title>
              <Subtitle variant="body1">
                Learn how practice spaces can help your teams thrive!CTA - Watch
              </Subtitle>
              <Btn
                onClick={() =>
                  window.open(
                    "https://drive.google.com/file/d/1DAiBMZdAx4rGprm_76Np1Je58u08AR2S/view?usp=sharing",
                    "_blank"
                  )
                }
              >
                WATCH
              </Btn>
            </GridItem>

            <GridItem>
              <BtnIndicator>EVENT</BtnIndicator>
              <Img src={CommHuddle} alt="Community Huddle" />
              <Title variant="h6">Connect and Learn</Title>
              <Subtitle variant="body1">
                Attend our next community huddle to see how Evivve can help your
                business thrive!
              </Subtitle>
              <Btn>ATTEND</Btn>
            </GridItem>
          </GridWrapper>
        </Box>
      </PageContainer>

      <CustomDialog
        open={openCommunityDialog}
        // heading="SCAN THE QR"
        // subheading={`Scan this QR code using the WhatsApp camera`}
        btn1Text="OKAY"
        onClose={() => setOpenCommunityDialog(false)}
        onConfirm={() => setOpenCommunityDialog(false)}
        img={WhatsAppQR}
        w="400px"
      />
    </>
  );

  // return (
  //   <iframe
  //     title="screen"
  //     scrolling="no"
  //     src="https://play.workadventu.re/_/4druupb1wng/evivve3.github.io/evivvecommunity/maps/map.json"
  //     width="100%"
  //     height={window.innerHeight + 10}
  //     frameBorder="0"
  //     allow="camera; microphone; display-capture; autoplay; clipboard-write;"
  //   />
  // );
};
export default CommunityPage;
