import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TimerComponent from "src/components/shared/TimerComponent";
import {
  getSelectedModule,
  setInitialVideo,
  setModuleProgress,
  setAudio,
} from "src/store/apps/present/PresentSlice";
import {
  HeaderContainer,
  HeadingText,
  ChevronBtnLeft,
  ChevronBtnRight,
  TimerText,
} from "./ModulesComponent";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons";
import { IndexCounter } from "./ModulesComponent";
import { useUpdateSession } from "src/services/present";

const DebriefModule = () => {
  const module = useSelector(getSelectedModule);
  const dispatch = useDispatch();
  const [currIdx, setCurrIdx] = useState(0);
  const updateSession = useUpdateSession();

  useEffect(() => {
    dispatch(setAudio());
    dispatch(setInitialVideo());
    updateSession.mutate({
      programStep: "DEBRIEF",
    });
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
        if (nextIdx >= module?.de_pts?.length) {
          nextIdx = 0;
        }
        return nextIdx;
      });
    } else if (type === "prev") {
      setCurrIdx((prevCurrIdx) => {
        let nextIdx = prevCurrIdx - 1;
        if (nextIdx < 0) {
          nextIdx = module?.de_pts?.length - 1;
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
        <HeadingText size="44px">{module?.de_pts[currIdx]?.title}</HeadingText>
        <br />
        <HeadingText size="34px">
          {module?.de_pts[currIdx]?.description}
        </HeadingText>
      </HeaderContainer>

      <IndexCounter>
        {currIdx + 1} / {module?.de_pts?.length}
      </IndexCounter>

      <div style={{ display: "none" }}>
        <TimerComponent
          textComponent={({ text }) => {
            return <TimerText>{text}</TimerText>;
          }}
          showAddTime={true}
          time={module?.de_dur_min * 60}
          onTimerTick={(val) => {
            dispatch(
              setModuleProgress({
                type: module.name,
                value: parseInt(
                  (module?.de_dur_min * 60 - val) *
                    (100 / (module?.de_dur_min * 60))
                ),
              })
            );
          }}
        />
      </div>
    </>
  );
};

export default DebriefModule;
