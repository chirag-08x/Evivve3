import styled from "@emotion/styled";
import { Heading, SubHeading } from "./ProgramStyles";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import {
  getCurrentTemplate,
  getSelectedProgram,
} from "src/store/apps/programs/ProgramSlice";
import { useEffect, useState } from "react";
import {
  useEditProgramHeading,
  useEditProgramSubheading,
} from "src/services/programs";
import { useNavigate, useParams } from "react-router";
import { Alert, Button } from "@mui/material";
import axiosClient from "../../../../utils/axios";
import { toast } from "react-toastify";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import { IconArrowLeft } from "@tabler/icons";

const Header = styled("header")`
  display: grid;
  grid-template-columns: 1fr auto;
`;

const EditBtn = styled("button")`
  background: none;
  border: none;
  display: none;
`;

const ProgramHeading = styled(Heading)`
  &:hover {
    > button {
      display: initial;
    }
  }
`;

const ProgramSubHeading = styled(SubHeading)`
  &:hover {
    > button {
      display: initial;
    }
  }
`;

const InnerContainer = styled("div")`
  display: grid;
`;

const InnerHeadingContainer = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const InputHeading = styled("input")`
  color: #101828;
  font-family: Inter;
  font-size: 30px;
  font-style: normal;
  font-weight: 500;
  line-height: 38px;
  width: 43rem;
`;

const InputSubheading = styled("input")`
  color: #667085;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  width: 36rem;
`;

const ProgramHeader = () => {
  const currentTemplate = useSelector(getCurrentTemplate);
  const program = useSelector(getSelectedProgram);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubheading, setIsEditingSubheading] = useState(false);
  const [title, setTitle] = useState("");
  const [subheading, setSubheading] = useState("");
  const updateTitle = useEditProgramHeading();
  const updateSubtitle = useEditProgramSubheading();
  const { id } = useParams();

  const [owner, setOwner] = useState(true);
  const [hasAccepted, setHasAccepted] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTitle(currentTemplate?.title);
    setSubheading(currentTemplate?.description);
  }, [currentTemplate]);

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleSubheadingEdit = () => {
    setIsEditingSubheading(true);
  };

  const handleTitleChange = (e) => {
    if (e.target.value.length > 45) return;
    setTitle(e.target.value);
  };

  const handleSubheadingChange = (e) => {
    if (e.target.value.length > 70) return;
    setSubheading(e.target.value);
  };

  const handleTitleSave = () => {
    updateTitle.mutate({
      name: title,
      id,
    });
    setIsEditingTitle(false);
  };

  const handleSubheadingSave = () => {
    updateSubtitle.mutate({
      desc: subheading,
      id,
    });
    setIsEditingSubheading(false);
  };

  const acceptInvite = async () =>
  {
    try {
      await axiosClient()
        .post(`/accept-invite/${id}`)
        .then(() => {
          toast.success("Invite Accepted!");
          toast.success("Please Conduct Dry Run");
          setHasAccepted("ACCEPTED");
        });
    }
    catch (error)
    {
      toast.error("Failed to accept the invite, Try again");
      console.log(error);
    }
  };

  const declineInvite = async () =>
  {
    try
    {
      await axiosClient()
          .post(`/decline-invite/${id}`)
          .then(() =>
          {
            toast.success("Invite Declined",{
              onClose: () =>
              {
                navigate(`/programs`, {state: {refresh: true}});
              }});

            setHasAccepted("DECLINED");
            });

      console.log(hasAccepted)
    }
    catch (error)
    {
      toast.error("Failed to decline the invite, Try again");
      console.log(error);
    }
  };

  useEffect(() =>
  {
    if (program.owner === false)
    {
      setOwner(false);

      if (program.facilitatorState === "" || program.facilitatorState === "DECLINED")
      {
        toast.error("You are not a facilitator or owner of this program", {
          onClose: () =>
          {
            navigate(`/programs`);
          }});
      }
      else
      {
        setHasAccepted(program.facilitatorState);
      }
    }
  }, [program.owner]);

  return (
    <Header>
      <InnerContainer>
        {!owner && hasAccepted === "INVITED" && (
          <div style={{ marginTop: "20px" }}>
            <Alert
              severity="info"
              style={{
                marginBottom: "20px",
                fontWeight: "bold",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
              }}
              action={
                <>
                  <Button
                    variant="contained"
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginRight: "10px",
                    }}
                    onClick={acceptInvite}
                  >
                    ACCEPT
                  </Button>
                  <Button
                    variant="contained"
                    style={{ fontSize: "12px", fontWeight: "bold" }}
                    onClick={declineInvite}
                  >
                    DECLINE
                  </Button>
                </>
              }
            >
              You've been invited to facilitate this program
            </Alert>
          </div>
        )}
        <InnerHeadingContainer>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ProgramHeading>
              {isEditingTitle && owner ? (
                <InputHeading
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={handleTitleSave}
                  autoFocus
                  readOnly={!owner}
                />
              ) : (
                <>
                  {title}{" "}
                  {owner && (
                    <EditBtn onClick={handleTitleEdit}>
                      <EditIcon fontSize="12px" />
                    </EditBtn>
                  )}
                </>
              )}
            </ProgramHeading>

            <ProgramSubHeading>
              {isEditingSubheading && owner ? (
                <InputSubheading
                  type="text"
                  value={subheading}
                  onChange={handleSubheadingChange}
                  onBlur={handleSubheadingSave}
                  autoFocus
                  readOnly={!owner}
                />
              ) : (
                <>
                  {subheading}{" "}
                  {owner && (
                    <EditBtn onClick={handleSubheadingEdit}>
                      <EditIcon fontSize="12px" />
                    </EditBtn>
                  )}
                </>
              )}
            </ProgramSubHeading>
          </div>
          <div>
            <PrimaryBtn
              style={{ padding: "5px 15px" }}
              width="auto"
              onClick={() => navigate("/programs")}
            >
              <IconArrowLeft />
              Back
            </PrimaryBtn>
          </div>
        </InnerHeadingContainer>
      </InnerContainer>
    </Header>
  );
};

export default ProgramHeader;

// Title {
//   name: "Update value";
// }

// Subtitle{
//   description: "Update value";
// }
