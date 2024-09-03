import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Quill.css";
import { Paper } from "@mui/material";

import PageContainer from "../../../components/container/PageContainer";
import ParentCard from "../../../components/shared/ParentCard";
import { PrimaryBtn } from "src/components/shared/BtnStyles";

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["clean"],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: ["small", false, "large", "huge"] }],
  ],
};

const QuillEditor = ({ text, onSave, onClose }) => {
  const [quillText, setQuillText] = useState(text || "");

  const handleOnSave = () => {
    onSave(quillText);
    onClose();
  };

  return (
    <PageContainer title="" description="this is Quill Editor page">
      <ParentCard title="Email Template">
        <Paper variant="outlined" sx={{ height: "460px", overflow: "scroll" }}>
          <ReactQuill
            value={quillText}
            onChange={(value) => {
              setQuillText(value);
            }}
            modules={modules}
            placeholder="Type here..."
            style={{
              wordBreak: "break-word",
              overflowY: "scroll",
            }}
          />
        </Paper>
      </ParentCard>
      <PrimaryBtn ml="auto" onClick={handleOnSave}>
        Save
      </PrimaryBtn>
    </PageContainer>
  );
};

export default QuillEditor;
