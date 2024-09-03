import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInitialVideo } from "src/store/apps/present/PresentSlice";
import { ReactComponent as NextIcon } from "src/assets/images/svgs/next.svg";
import { SecondaryBtn } from "src/components/shared/BtnStyles";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SafeSocketProvider from "src/services/safeSocketProvider";
import { v4 as uid } from "uuid";
import QRCodeStyling from "qr-code-styling";
import AppLogo from "../../../../assets/images/present/menu_logo_active.png";
import { toast } from "react-toastify";

const GameLobbyWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const PlayersContainer = styled("div")`
  position: relative;
`;

const PlayersWrapper = styled("div")`
  margin-left: 10rem;
  margin-top: 2rem;
  max-height: 24rem;
  overflow-x: hidden;
  overflow-y: scroll;
  text-align: center;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: black;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
  }
`;

const PlayerName = styled("p")`
  color: #fff;
  font-size: 1rem;
  font-weight: 400;
  width: 100%;
  padding: 0.3rem 2.25rem;
  background-color: #000;
  margin: 0;
  display: flex;
  /* align-items: center; */
  justify-content: center;
  gap: 0 5px;
`;

const PlayerNameInnerWrapper = styled("div")`
  display: grid;
  gap: 1px;
  margin-top: 4px;
`;

const PlayersNameTitle = styled("p")`
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  padding: 0.5rem 2.25rem 0 2.25rem;
  margin: 0;
  background-color: #000;
`;

const ActivePlayers = styled("span")`
  font-size: 14px;
  font-weight: 400;
`;

const QrCodeWrapper = styled("div")`
  margin-right: 10rem;
  margin-top: 2rem;
`;

const QrCodeImg = styled("img")`
  width: 6.8125rem;
  height: 6.8125rem;
`;

const QrCodeText = styled("p")`
  width: 6.8125rem;
  font-size: 1.5rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  line-height: 1.1;
  padding: 0.4rem;
`;

const QrCodeInnerText = styled("span")`
  color: #e8c48f;
  font-weight: 700;
`;

const BtnWrapper = styled("div")`
  position: absolute;
  right: 1rem;
  margin-top: 1rem;
`;

const GameLobby = () => {
  const dispatch = useDispatch();
  const { qrCode, qrCodeImg, players } = useSelector(
    (state) => state?.present?.game
  );
  const [activePlayers, setActivePlayers] = useState(0);
  const qrCodeRef = useRef(null);
  let link = `${process.env.REACT_APP_DEEPLINK_URL}/?`;

  useEffect(() => {
    let activeNumbers = 0;
    players.forEach(({ status }) => {
      if (status === "CONNECTED") {
        activeNumbers += 1;
      }
    });
    setActivePlayers(activeNumbers);
  }, [players]);

  useEffect(() => {
    if (!qrCode) {
      return;
    }

    link += `mode=multiplayer&code=${qrCode}`;

    const generatedQrCode = new QRCodeStyling({
      width: 120,
      height: 120,
      data: link,
      image: AppLogo,
      dotsOptions: {
        color: "#430f74",
        type: "rounded",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5, //20
      },
      cornersDotOptions: {
        color: "#d11717",
      },
      cornersSquareOptions: {
        color: "#d11717",
        type: "extra-rounded",
      },
    });

    generatedQrCode.append(qrCodeRef.current);
  }, [qrCode]);

  useEffect(() => {
    return () => {
      dispatch(setInitialVideo());
    };
  }, [dispatch]);

  const OpenPlayerConsole = (e) => {
    // console.log(window.location.origin);
    window.open(`/evivve3/game/index.html`, "_blank");
    // e.stopPropagation();
  };

  useEffect(() => {
    SafeSocketProvider.on("limit-reached", (data) => {
      if (data.player)
        alert(
          `Dry run player cap reached. Player: "${data.player}" denied connection.`
        );
      else alert(`Dry run player cap reached. A player was denied connection.`);
    });

    return () => {
      SafeSocketProvider.off("limit-reached");
    };
  }, []);

  return (
    <GameLobbyWrapper>
      <PlayersContainer>
        <PlayersWrapper>
          <PlayersNameTitle>
            {players.length} Players{" "}
            <ActivePlayers>({activePlayers} active)</ActivePlayers>{" "}
          </PlayersNameTitle>
          <PlayerNameInnerWrapper>
            {players.map(({ id, name, status }) => {
              return (
                <PlayerName
                  key={id ? id : uid()}
                  style={{ opacity: status !== "CONNECTED" && "0.7" }}
                >
                  {name.split(" ")[0]}
                  {status === "CONNECTED" && (
                    <FiberManualRecordIcon
                      style={{
                        color: "#12B76A",
                        fontSize: "8px",
                        marginTop: "5px",
                      }}
                    />
                  )}
                </PlayerName>
              );
            })}
          </PlayerNameInnerWrapper>
        </PlayersWrapper>

        <BtnWrapper>
          <SecondaryBtn onClick={(e) => OpenPlayerConsole(e)} width="200px">
            Player Console&nbsp;
            <NextIcon height="1rem" width="1rem" />
          </SecondaryBtn>
          <SecondaryBtn
            width="200px"
            onClick={() => {
              toast.success("Link Copied.");
              navigator.clipboard.writeText(
                `${window.location.origin}/evivve3/game/index.html`
              );
            }}
            style={{
              margin: "0.5rem auto 0 auto",
            }}
          >
            Copy Link
          </SecondaryBtn>
        </BtnWrapper>
      </PlayersContainer>

      <QrCodeWrapper>
        <div ref={qrCodeRef} />
        <QrCodeText>
          Enter Game Code <QrCodeInnerText>{qrCode}</QrCodeInnerText>
        </QrCodeText>
      </QrCodeWrapper>
    </GameLobbyWrapper>
  );
};

export default GameLobby;
