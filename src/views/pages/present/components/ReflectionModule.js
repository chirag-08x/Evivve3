import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TimerComponent from "src/components/shared/TimerComponent";
import {
  getPresentModeSetting,
  getPresentModules,
  getSelectedModule,
  setInitialVideo,
  setModuleProgress,
  setSelectedModule,
  setAudio,
} from "src/store/apps/present/PresentSlice";
import {
  HeaderContainer,
  HeadingText,
  SubText,
  ChevronBtnLeft,
  ChevronBtnRight,
  TimerText,
} from "./ModulesComponent";
import GameAdmin from "./GameAdmin";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons";
import { useUpdateSession } from "src/services/present";

const ReflectionModule = () => {
  const module = useSelector(getSelectedModule);
  const { autoplay } = useSelector(getPresentModeSetting);
  const dispatch = useDispatch();
  const modules = useSelector(getPresentModules);
  const curModuleIndex = modules.indexOf(module);
  const { players } = useSelector((state) => state?.present?.game);
  const [currIdx, setCurrIdx] = useState(0);
  const updateSession = useUpdateSession();

  const handleNextClick = () => {
    if (autoplay) dispatch(setSelectedModule(modules[curModuleIndex + 1]));
  };

  useEffect(() => {
    dispatch(
      setAudio("https://d3cyxgc836sqrt.cloudfront.net/audios/reflection.mp3")
    );
    dispatch(setInitialVideo());
    updateSession.mutate({
      programStep: "REFLECTION",
    });
    if (players.length > 0) {
      GameAdmin.Logout();
    }
  }, []);

  useEffect(() => {
    dispatch(
      setModuleProgress({
        type: module.name,
        value: 0,
      })
    );
  }, [dispatch, module]);

  const handleHeaderIdx = (type) => {
    if (type === "next") {
      setCurrIdx((prevCurrIdx) => {
        let nextIdx = prevCurrIdx + 1;
        if (nextIdx >= module?.re_que?.length) {
          nextIdx = 0;
        }
        return nextIdx;
      });
    } else if (type === "prev") {
      setCurrIdx((prevCurrIdx) => {
        let nextIdx = prevCurrIdx - 1;
        if (nextIdx < 0) {
          nextIdx = module?.re_que?.length - 1;
        }
        return nextIdx;
      });
    }
  };

  return (
    <>
      <ChevronBtnLeft onClick={() => handleHeaderIdx("prev")}>
        <IconChevronLeft size={100} />
      </ChevronBtnLeft>
      <ChevronBtnRight onClick={() => handleHeaderIdx("next")}>
        <IconChevronRight size={100} />
      </ChevronBtnRight>
      <HeaderContainer>
        <HeadingText size="34px">{module?.re_que[currIdx]}</HeadingText>
      </HeaderContainer>

      <div style={{ display: "none" }}>
        <TimerComponent
          textComponent={({ text }) => {
            return <TimerText>{text}</TimerText>;
          }}
          showAddTime={true}
          time={module?.re_dur_min * 60}
          onTimerEnd={handleNextClick}
          onTimerTick={(val) => {
            dispatch(
              setModuleProgress({
                type: module.name,
                value: parseInt(
                  (module?.re_dur_min * 60 - val) *
                    (100 / (module?.re_dur_min * 60))
                ),
              })
            );
          }}
        />
      </div>
    </>
  );
};

export default ReflectionModule;
