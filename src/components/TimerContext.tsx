import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from "react-i18next";

import { PHASE_TICK_NUM, logsState, settingsState } from '../common';

const TimerContext = React.createContext<TimerContextType | null>(null);

export enum TimerStatus {
  Inactive = "Inactive",
  Active = "Active",
  Finished = "Finished",
}

export type TimerContextType = {
  state: TimerStatus;
  setState: (state: TimerStatus) => void;
  tickStart: () => void;
  tickStop: () => void;
  tickPause: () => void;
  tick: number;
  resetTime: () => void;
  phase: number;
};

const TimerProvider = (props: any) => {
  const { t } = useTranslation();
  const [state, setState] = useState<TimerStatus>(TimerStatus.Inactive);
  const [tick, setTick] = useState(0);
  const [phase, setPhase] = useState(0);
  const [logs, setLogs] = useRecoilState(logsState);
  const [settings] = useRecoilState(settingsState);
  const MaxTick = Math.pow(2, settings.diskNum) * PHASE_TICK_NUM;

  const tickStart = () => {
    setState(TimerStatus.Active);
  };

  const tickStop = () => {
    setState(TimerStatus.Finished);
  };

  const tickPause = () => {
    setState(TimerStatus.Inactive);
  };

  const resetTime = () => {
    setTick(0);
    setPhase(0);
    setState(TimerStatus.Inactive);
  };

  useEffect(() => {
    let timerId: any;
    switch (state) {
      case TimerStatus.Inactive:
        if (tick === 0) {
          setLogs([{ time: new Date(), message: `[${t("System")}] ${t("Initialized")}` }, ...logs]);
        }
        break;
      case TimerStatus.Active:
        timerId = setInterval(() => {
          let nextTick = tick + 1;
          if (MaxTick <= nextTick) {
            setLogs([{ time: new Date(), message: `[${t("System")}] ${t("Stopped by MaxTick Limit")}: ${MaxTick}` }, ...logs]);
            tickStop();
          } else {
            setTick(nextTick);
            if (nextTick % PHASE_TICK_NUM === 0) {
              setPhase((p: number) => p + 1);
            }
          }
        }, settings.tickDelay);
        break;
      case TimerStatus.Finished:
        if (timerId !== 0) {
          clearInterval(timerId);
        }
        break;
    }
    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, tick]);

  return (
    <TimerContext.Provider value={{ state, setState, tick, tickStart, tickStop, tickPause, resetTime, phase }}>
      {props.children}
    </TimerContext.Provider>
  );
}

export { TimerContext, TimerProvider };
