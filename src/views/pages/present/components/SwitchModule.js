import React from "react";
import { MODULE_TYPE } from "../constants";
import DebriefModule from "./DebriefModule";
import GameModule from "./GameModule";
import LearnerActivationModule from "./LearnerActivationModule";
import LoadingModule from "./LoadingModule";
import ReflectionModule from "./ReflectionModule";
import StrategyPlanningModule from "./StrategyPlanningModule";
import AlertExitGame from "./AlertExitGame";
import { useSelector } from "react-redux";

const SwitchModule = ({ type }) => {
  const { showAlert } = useSelector((state) => state?.present?.game);
  switch (type) {
    case MODULE_TYPE["loading_module"]: {
      return <LoadingModule />;
    }
    case MODULE_TYPE["learner/activation"]: {
      return <LearnerActivationModule />;
    }
    case MODULE_TYPE["strategy&planning"]: {
      return <StrategyPlanningModule />;
    }
    case MODULE_TYPE["evivve"]: {
      return (
        <>
          <GameModule />
          {showAlert && (
            <AlertExitGame
              heading={"Are you Sure?"}
              subheading={"Performing this action will end this game session."}
              btn1Text={"Yes, Go back"}
              btn2Text={"Cancel, Stay here"}
            />
          )}
        </>
      );
    }
    case MODULE_TYPE["reflection"]: {
      return (
        <>
          <ReflectionModule />
          {showAlert && (
            <AlertExitGame
              heading={"Your game has ended"}
              subheading={"Would you like to launch a new Game ?"}
              btn1Text={"Yes, launch a new Game"}
              btn2Text={"No, stay here"}
            />
          )}
        </>
      );
    }
    case MODULE_TYPE["debrief"]: {
      return <DebriefModule />;
    }
    default:
      return <div></div>;
  }
};

export default SwitchModule;
