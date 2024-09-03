import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SecondaryBtn } from "src/components/shared/BtnStyles";
import {
  getPresentModules,
  getSelectedModule,
  setAudio,
  setSelectedModule,
} from "src/store/apps/present/PresentSlice";
import { useUpdateSession } from "src/services/present";
import { ChecklistActions } from "../DryRunChecklist";

const LoadingModule = () => {
  const modules = useSelector(getPresentModules);
  const selectedModule = useSelector(getSelectedModule);
  const dispatch = useDispatch();
  const curModuleIndex = modules.indexOf(selectedModule);
  const [showBegin, setShowBegin] = useState(false);
  const updateSession = useUpdateSession();

  const handleNextClick = () => {
    dispatch(setSelectedModule(modules[curModuleIndex + 1]));
    ChecklistActions["toggleDryRun"]();
  };

  useEffect(() => {
    updateSession.mutate({
      programStep: "BEGIN",
    });

    dispatch(setAudio());
    setTimeout(() => {
      setShowBegin(true);
    }, 1500);
  }, []);

  if (!showBegin) {
    return <></>;
  }

  return <SecondaryBtn onClick={handleNextClick}>Begin</SecondaryBtn>;
};

export default LoadingModule;
