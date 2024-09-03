import { ThemeProvider } from "@mui/material";
import React from "react";
import PageContainer from "src/components/container/PageContainer";
import { BuildTheme } from "src/theme/Theme";
import ProgramList from "./components/ProgramList";

// components

const Programs = () => {
  const theme = BuildTheme({
    theme: "CUSTOM_THEME",
    direction: "ltr",
    light: true,
  });

  return (
    <ThemeProvider theme={theme}>
      <PageContainer title="Programs" description="Evivve programs">
        <ProgramList />
      </PageContainer>
    </ThemeProvider>
  );
};

export default Programs;
