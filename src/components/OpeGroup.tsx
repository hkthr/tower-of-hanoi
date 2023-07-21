import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from "react-i18next";

import { Box, Stack, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

import Operation from './Operation';
import { OpeState, OpeAction, SettingData, logsState, settingsState } from '../common';
import AppDialog from "./Dialog";

interface OpeGroupProps {
  startHandler: () => void,
  pauseHandler: () => void,
  resetHandler: () => void,
  hanoiState: OpeState,
}

const OpeGroup = (props: OpeGroupProps) => {
  const { t } = useTranslation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [logs, setLogs] = useRecoilState(logsState);
  const [settings, setSettings] = useRecoilState(settingsState);

  const onClickSettings = () => {
    console.log(settings);
    setDialogOpen(true);
  }
  const onStart = () => {
    if (props.startHandler != null) {
      props.startHandler();
    }
  }
  const onPause = () => {
    if (props.pauseHandler != null) {
      props.pauseHandler();
    }
  };
  const onReset = () => {
    if (props.resetHandler != null) {
      props.resetHandler();
    }
  }
  const handleDialogClose = () => setDialogOpen(false);
  const handleDialogSave = (settingData: SettingData) => {
    setLogs([{ time: new Date(), message: `[Exec] Save Setting: ${JSON.stringify(settingData)}` }, ...logs]);
    setSettings(settingData);
    onReset();
  }

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ pt: 0 }}>
        <Operation name="Start" action={OpeAction.PushStart} enableStates={[OpeState.Initialized, OpeState.Paused]} handler={onStart} />
        <Operation name="Pause" action={OpeAction.PushPause} enableStates={[OpeState.Started]} handler={onPause} />
        <Operation name="Reset" action={OpeAction.PushReset} enableStates={[OpeState.Finished]} handler={onReset} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
          <Tooltip title={t("Settings")}>
            <SettingsIcon onClick={onClickSettings} />
          </Tooltip>
          <AppDialog
            open={dialogOpen}
            onClose={handleDialogClose}
            onSave={handleDialogSave}
            settingData={settings}
          />
        </Box>
      </Stack>
    </Box>
  );
}

export default OpeGroup;
