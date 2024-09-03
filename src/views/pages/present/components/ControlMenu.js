import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { PrimaryBtn, PrimaryBtn2 } from "src/components/shared/BtnStyles";
import { ReactComponent as Close } from "src/assets/images/svgs/cross.svg";
import { IconExternalLink } from "@tabler/icons";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useMutation } from "react-query";
import axiosClient from "src/utils/axios";

const Container = styled("div")`
  display: flex;
  width: 317px;
  padding: 30px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  position: relative;
`;
const RowContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 15px;
  align-self: stretch;
  border-bottom: ${(props) => (props.hideBorder ? "0" : "1")}px solid #ebeef1;
`;
const ButtonContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Heading = styled("div")`
  color: #0e1e2f;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  display: flex;
  width: 212px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Message = styled("span")`
  color: #667085;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`;

const CrossButtonContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
  padding: 5px;
`;

function useRequestRemoteControl ({onSuccess, onError}) {
    return useMutation(
        async data => await axiosClient()
        .post(`/program_session/${data.sessionId}/remote_control/request`),
        {
            onSuccess,
            onError
        }
    );
}

const ControlMenu = ({ onClose }) => {
  const { id } = useParams();
  const reqRemoteControl = useRequestRemoteControl({
      onSuccess: () => {
          toast.success("Remote control URL sent to your email id");
          onClose();
      },
      onError: (err) => {
          if (err.error == "DRY_RUN_RESTRICTION") {
              alert("This feature restricted for dry run");
          }
          onClose();
      }
  });

  const user_email = useSelector((state) => state?.user?.profile?.email);
  const [url, setUrl] = useState(
    `${process.env.REACT_APP_GAME_APP}/evivve3/remote-control/index.html?session=${id}`
  );

  useEffect(() => {
    setUrl(`${process.env.REACT_APP_GAME_APP}/evivve3/remote-control/index.html?session=${id}`);
  }, [id]);

  function sendRemoteControl () {
      reqRemoteControl.mutate({
        sessionId: id
      });
  }

  return (
    <Container>
      <CrossButtonContainer onClick={onClose}>
        <Close stroke="#000000" />
      </CrossButtonContainer>
      <RowContainer>
        <Heading>Controls</Heading>
      </RowContainer>
      <RowContainer hideBorder>
        <Message>
          Send the controls to your email (You can access from your mobile device):
          <br />
          <b>{user_email || "[Email not found]"}</b>
        </Message>
      </RowContainer>
      <ButtonContainer>
        <PrimaryBtn2
          width="120px"
          onClick={() => {
            navigator.clipboard.writeText(url);
            onClose();
          }}
        >
          Copy URL
        </PrimaryBtn2>
        <PrimaryBtn
          width="120px"
          onClick={sendRemoteControl}
        >
          Send
        </PrimaryBtn>
        {false && <PrimaryBtn
          width="120px"
          onClick={() => {
            window.open(url, "_blank");
            onClose();
          }}
        >
          Open <IconExternalLink size="14px" />
        </PrimaryBtn>}
      </ButtonContainer>
    </Container>
  );
};

export default ControlMenu;
