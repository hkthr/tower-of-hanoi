import React, { useState, useEffect, useContext } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from "react-i18next";

import { Box, Container } from '@mui/material';

import OpeGroup from './OpeGroup';
import Tower from './Tower';
import Info from './Info';
import {
  OpeState, OpeAction, getNextState, getDurationFromSeconds, formatTime,
  logsState, settingsState, langState, hanoiOpeState
} from '../common';
import { TimerStatus, TimerContext, TimerContextType } from "./TimerContext";
import { initHanoiContext, getNextLayout, HanoiContext, getTargetColumn } from "../hanoi";
import Log from './Log';

interface ContentProps {
}

const Content = (props: ContentProps) => {
  const { t } = useTranslation();
  const [hanoiCtx, setHanoiCtx] = useState<HanoiContext | null>(null);
  const { state, setState, phase, tickStart, tickPause, resetTime } = useContext(TimerContext) as TimerContextType;
  const [logs, setLogs] = useRecoilState(logsState);
  const [settings,] = useRecoilState(settingsState);
  const [opeState, setOpeState] = useRecoilState(hanoiOpeState);
  const [language,] = useRecoilState(langState);

  const startHandler = () => {
    const now = new Date();
    setLogs([{ time: now, message: `[${t("System")}] ${t("Tower of Hanoi Started")}: ${formatTime(now.getTime())}` }, ...logs]);
    if (hanoiCtx != null) {
      hanoiCtx.startTime = now.getTime();
    }
    setState(TimerStatus.Active);
    tickStart();
  };
  const pauseHandler = () => {
    setState(TimerStatus.Inactive);
    tickPause();
  };
  const resetHandler = () => {
    setLogs([]);
    resetTime();
    setOpeState(OpeState.Initialized);
    const ctx = initHanoiContext(settings.diskNum);
    setHanoiCtx(ctx);
  }
  const doFinish = () => {
    if (hanoiCtx != null) {
      hanoiCtx.endTime = new Date().getTime();
      const millis = hanoiCtx.endTime - hanoiCtx.startTime;
      const dur = getDurationFromSeconds(millis / 1000, language);
      setLogs([{ time: new Date(), message: `[${t("System")}] ${t("Tower of Hanoi Finished")}: ${formatTime(hanoiCtx.endTime)}, ${t("Duration")}:${dur}` }, ...logs]);
    }
    getNextState(OpeAction.ElapsedTime, opeState, setOpeState);
  }
  const sourceDisks = (hanoiCtx != null && hanoiCtx.layouts != null) ? hanoiCtx.layouts[hanoiCtx.layouts.length - 1]?.source ?? [] : [];
  const viaDisks = (hanoiCtx != null && hanoiCtx.layouts != null) ? hanoiCtx.layouts[hanoiCtx.layouts.length - 1]?.via ?? [] : [];
  const destDisks = (hanoiCtx != null && hanoiCtx.layouts != null) ? hanoiCtx.layouts[hanoiCtx.layouts.length - 1]?.dest ?? [] : [];
  const getCount = () => {
    const len = hanoiCtx?.layouts.length ?? 0;
    return len > 0 ? len - 1 : 0;
  }
  const diskNames = ["Source", "Via", "Dest"];

  useEffect(() => {
    switch (state) {
      case TimerStatus.Active:
        if (hanoiCtx != null) {
          const nextLayout = getNextLayout(hanoiCtx);
          if (nextLayout != null) {
            if (hanoiCtx.lastMove) {
              const columns = getTargetColumn(nextLayout, hanoiCtx.lastMove.destNo);
              const diskNo = columns.shift();
              if (diskNo != null) {
                columns.unshift(diskNo);
              }
              setLogs([{ time: new Date(), message: `[${t("Move")}]:${diskNo} ${t(diskNames[hanoiCtx.lastMove.sourceNo])} -> ${t(diskNames[hanoiCtx.lastMove.destNo])}` }, ...logs]);
            }
          }
        }
        break;
      case TimerStatus.Finished:
        doFinish();
        break;
    }
  }, [phase, state]);

  useEffect(() => {
    const ctx = initHanoiContext(settings.diskNum);
    setHanoiCtx(ctx);
  }, [settings.diskNum]);

  return (
    <Container data-testid="qsContent" maxWidth={false} sx={{ml: "auto", mr: "auto"}}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2 }}>
          <OpeGroup startHandler={startHandler} pauseHandler={pauseHandler} resetHandler={resetHandler} hanoiState={opeState} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Tower name="Source" disks={sourceDisks} />
          <Tower name="Via" disks={viaDisks} />
          <Tower name="Dest" disks={destDisks} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Info status={opeState} count={getCount()} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, width: '100%' }}>
          <Log />
        </Box>
      </Box>
    </Container>
  );
}

export default Content;
