import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DisappearingTextComponent from "src/components/shared/DisappearingTextComponent";
import TimerComponent from "src/components/shared/TimerComponent";
import {
  getPresentModeSetting,
  getPresentModules,
  getSelectedModule,
  setModuleProgress,
  setSelectedModule,
  setAudio,
  setInitialVideo,
} from "src/store/apps/present/PresentSlice";
import { TimerText } from "./ModulesComponent";
import { useUpdateSession } from "src/services/present";

const StrategyPlanningModule = () => {
  const module = useSelector(getSelectedModule);
  const { autoplay } = useSelector(getPresentModeSetting);
  const dispatch = useDispatch();
  const modules = useSelector(getPresentModules);
  const curModuleIndex = modules.indexOf(module);
  const updateSession = useUpdateSession();

  useEffect(() => {
    updateSession.mutate({
      programStep: "STRATEGY_PLANNING",
    });
    dispatch(
      setAudio("https://d3cyxgc836sqrt.cloudfront.net/audios/strategy.mp3")
    );
    dispatch(setInitialVideo(2));
  }, []);

  const handleNextClick = () => {
    if (autoplay) dispatch(setSelectedModule(modules[curModuleIndex + 1]));
  };

  useEffect(() => {
    dispatch(
      setModuleProgress({
        type: module.name,
        value: 0,
      })
    );
  }, [dispatch, module]);

  return (
    <>
      <TimerComponent
        textComponent={({ text }) => {
          return <TimerText>{text}</TimerText>;
        }}
        showAddTime={true}
        time={module?.sp_dur_min * 60}
        onTimerEnd={handleNextClick}
        onTimerTick={(val) => {
          dispatch(
            setModuleProgress({
              type: module.name,
              value: parseInt(
                (module?.sp_dur_min * 60 - val) *
                  (100 / (module?.sp_dur_min * 60))
              ),
            })
          );
        }}
      />
      <DisappearingTextComponent
        texts={module?.sp_sms}
        timer={2500}
        textTimer={30000} // timer in milli-seconds(ms)
        transitionTimer={2000} // timer in milli-seconds(ms)
        repeat={false}
        textStyle={{
          color: "#ffffff",
          width: "80%",
          marginTop: "30px",
          minHeight: "200px",
        }}
      />
    </>
  );
};

export default StrategyPlanningModule;
