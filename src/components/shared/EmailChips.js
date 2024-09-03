import React, { useState } from "react";
import styled from "@emotion/styled";
import { Avatar, Chip } from "@mui/material";
import User1 from "../../assets/images/profile/user-1.jpg";
import validator from "validator";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { toggleEditFlag } from "src/store/apps/programs/ProgramSlice";

const Wrapper = styled("div")`
  height: 122px;
  border: 1px solid #dfe5ef;
  border-radius: 8px;
  padding: 1rem;
  overflow-y: auto;
`;

const ChipsWrapper = styled("div")`
  margin-bottom: 6px;
`;

const InputWrapper = styled("div")``;

const EmailInput = styled("textarea")`
  width: 100%;
  word-break: break-all;
  resize: none;
  font-size: 1rem;
  border: none;
  outline: none;

  &::placeholder {
    font-size: 14px;
    font-family: Inter;
  }
`;

const EmailChips = ({ value = [], placeholder, onChange, name, updateChips, owner }) => {
  const [emails, setEmails] = useState(value);
  const [currentEmail, setCurrentEmail] = useState("");
  const dispatch = useDispatch();

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      if (currentEmail.trim().length === 0) return;
      
      const emailArray = currentEmail.split(",").map(email => email.trim()).filter(email => email.length > 0);
      let validEmails = [];
      let invalidEmails = [];
      
      emailArray.forEach(email => {
        if (validator.isEmail(email)) {
          if (emails.includes(email)) {
            toast.warning("Email address already present.");
          } else {
            validEmails.push(email);
          }
        } else {
          invalidEmails.push(email);
        }
      });

      if (invalidEmails.length > 0) {
        toast.warning(`Please enter a valid email address`);
      }

      if (validEmails.length > 0) {
        const updatedEmails = [...emails, ...validEmails];
        setEmails(updatedEmails);
        updateChips(updatedEmails);
        dispatch(toggleEditFlag(true));
        setCurrentEmail("");
        onChange(e);
      }
    }
  };

  const handleRemoveChip = (item) => {
    if (!owner) return;
    const filteredChips = emails.filter(email => email !== item);
    setEmails(filteredChips);
    updateChips(filteredChips);
  };

  return (
    <Wrapper>
      {emails.length > 0 && (
        <ChipsWrapper>
          {emails.map((item, idx) => {
            return (
              <Chip
                avatar={<Avatar alt="Natacha" src={User1} />}
                key={idx}
                label={item}
                color="primary"
                onDelete={owner ? () => handleRemoveChip(item) : undefined}
                style={{
                  marginBottom: "3px",
                  marginRight: "3px",
                }}
              />
            );
          })}
        </ChipsWrapper>
      )}
      <InputWrapper>
        <EmailInput
          type="text"
          value={currentEmail}
          name={name}
          onChange={(e) => {
            if (!owner) return;
            setCurrentEmail(e.target.value);
            dispatch(toggleEditFlag(true));
          }}
          placeholder={placeholder}
          autoFocus
          onKeyDown={handleInputKeyDown}
          readOnly={!owner}
          disabled={!owner}
          style={{ cursor: owner ? "text" : "not-allowed", backgroundColor: owner ? "white" : "#f5f5f5" }}
        />
      </InputWrapper>
    </Wrapper>
  );
};

export default EmailChips;
