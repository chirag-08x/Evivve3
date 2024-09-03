import { AccountCircle, CheckCircleRounded } from "@mui/icons-material";
import { Autocomplete, Box, Dialog, DialogContent, TextField } from "@mui/material";
import { IconArrowLeft } from "@tabler/icons";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import { DialogHeading } from "src/components/shared/DialogComponents";
import axiosClient from "src/utils/axios";

function useVerifyEmailMutation ({onSuccess, onError}) {
    return useMutation(
        async data => await axiosClient()
        .post("/verifyEmail", {
            email: data.email
        }),
        {
            onSuccess,
            onError
        }
    );
}

function useTransferCreditsMutation ({onSuccess, onError}) {
    return useMutation(
        async data => await axiosClient()
        .post("/credits/transfer", {
            credits: data.credits,
            recipient_email: data.email
        }),
        {
            onSuccess,
            onError
        }
    );
}

const TransferCreditsDialog = ({open, onClose}) => {
    const requestTimeoutHandle = useRef(null);
    const [textFocused, setTextFocused] = useState(false);
    const [userFound, setUserFound] = useState(false);
    const [recipientName, setRecipientName] = useState("");
    const [credits, setCredits] = useState(0);
    const [email, setEmail] = useState();

    const verifyEmail = useVerifyEmailMutation({
        onSuccess: ({data}) => {
            setRecipientName(data.name);
            setUserFound(true);
        },
        onError: () => {
            setRecipientName("");
            setUserFound(false);
        }
    });

    const transferCredits = useTransferCreditsMutation({
        onSuccess: () => {
            setEmail('');
            setUserFound(false);
            setRecipientName("");
            toast.success("Credits transfered successfully");
            setCredits(0);
        },
        onError: (obj) => {
            console.log("Error:")
            console.dir(obj);
            switch (obj.error) {
                case "CREDITS_INVALID":
                    toast.error("Credits to transfer have to be more than zero")
                    break;
                case "RECIPIENT_NOT_FOUND":
                    toast.error("Recipient not found")
                    break;
                case "INSUFFICIENT_CREDITS":
                    toast.error("Insufficient credits")
                    break;
                case "SAME_USER":
                    toast.error("Cannot transfer credits to yourself");
                    break;
                default:
                    toast.error("Unexpected error, contact support if persists")
                    break;
            }
            setCredits(0);
        }
    })

    useEffect(() => {
        if (open) {
            setEmail('');
            setUserFound(false);
            setRecipientName("");
            setCredits(0);
        }
    }, [open])

    function onEmailChanged (e) {
        setUserFound(false);
        setEmail(e.target.value);
        if (requestTimeoutHandle.current)
            clearTimeout(requestTimeoutHandle.current);
        requestTimeoutHandle.current = setTimeout(() => {
            verifyEmail.mutate({email: e.target.value})
        }, 500);
    }

    function onTransfer () {
        transferCredits.mutate({credits, email});
    }

    return (
    <Dialog
      PaperProps={{
        style: {
          borderRadius: "8px",
          background: "#FFF",
          boxShadow:
            "0px 24px 36px -8px rgba(0, 0, 0, 0.25), 0px 0px 1px 0px rgba(0, 0, 0, 0.31)",
          width: "500px",
          padding: "1rem",
        },
      }}
      maxWidth="900px"
      open={open}
      onClose={onClose}
    >
      <DialogHeading style={{display: 'flex', alignItems: 'center', textAlign: "left", padding: "15px 0px 10px 0px" }}>
          <button
            style={{
              width: "50px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              marginRight: '5px',
              marginTop: '4px'
            }}
            onClick={onClose}
          >
        <IconArrowLeft />
      </button>
        Transfer Credits
      </DialogHeading>
      <div style={{padding: '16px', marginTop: '20px'}}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <TextField
              value={email}
              onFocus={() => setTextFocused(true)}
              onBlur={() => setTextFocused(false)}
              helperText={userFound ? <span style={{display: 'flex', alignItems: 'center', color: 'darkgreen'}}><CheckCircleRounded fontSize="14px" style={{marginRight: "3px"}}/>{recipientName}</span> : textFocused ? "User not found" : "No user selected"}
              onChange={onEmailChanged}
              id="demo-helper-text-misaligned"
              style={{marginRight: '20px'}}
              InputLabelProps={{
                shrink: true,
              }}
              label="User Email"
            />
            <TextField
              id="outlined-number"
              label="Credits"
              type="number"
              value={credits}
              onChange={e => setCredits(e.target.value)}
              style={{width: '100px', marginRight: '20px'}}
              InputProps={{ inputProps: { min: 0, max: 10 } }}
              InputLabelProps={{
                shrink: true,
              }}
            />
              <PrimaryBtn
                style={{ fontSize: "14px", padding: "8px 5px", height: "45px" }}
                disabled={!userFound || credits <= 0}
                onClick={onTransfer}
              >
                Transfer
              </PrimaryBtn>
        </div>
      </div>
    </Dialog>
    );
}

export default TransferCreditsDialog;
