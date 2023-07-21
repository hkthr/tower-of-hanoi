import React from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from "react-i18next";

import { Box, Typography } from '@mui/material';

import { PHASE_TICK_NUM, getDurationFromSeconds, settingsState, langState } from '../common';

interface InfoProps {
  status: string,
  count: number,
}

const Info = (props: InfoProps) => {
  const { t } = useTranslation();

  const [settings] = useRecoilState(settingsState);
  const [language] = useRecoilState(langState);

  const getRestCount = () => {
    return Math.pow(2, settings.diskNum) - props.count - 1;
  }
  const getRemaining = () => {
    const remaining = Math.round(getRestCount() * PHASE_TICK_NUM * settings.tickDelay / 1000);
    if (remaining === 0) {
      return "0"
    }
    return `${getDurationFromSeconds(remaining, language)}`;
  }
  const renderMainLabel = (label: string) => {
    return (
      <Box sx={{ display: 'inline-block', p: 0.6, pl: 2, pr: 2, mr: 0.8, borderRadius: 1, bgcolor: 'primary.main', color: 'white' }}>
        <Typography component={'span'} variant="body2">
          {label}
        </Typography>
      </Box>
    );
  }
  const renderItem = (label: string, value: string) => {
    return (
      <Box sx={{ display: 'block', p: 0.5, m: 0.5, borderRadius: 1, bgcolor: 'primary.light', color: 'white' }}>
        <Typography component={'span'} variant="body2">
          {label}
        </Typography>
        <Box sx={{ display: 'inline', p: 0.1, pl:0.6, pr:0.6, m: 0.2, ml: 1, borderRadius: 1, bgcolor: 'secondary.light', color: 'white' }}>
          <Typography component={'span'} variant="body2">
            {value}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box data-testid="info">
      <Typography component={'div'} fontSize="12">
        <Box sx={{ display: 'flex', flexDirection: 'row', border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1, }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', ml: 1, mr: 0.5, alignItems: 'center', justifyContent: 'center' }}>
            {renderMainLabel(`${t("Info")}`)}
          </Box>
          <Box sx={{ mr: 0.5 }}>
            {renderItem(t("DiskNum"), String(settings.diskNum))}
          </Box>
          <Box sx={{ mr: 0.5 }}>
            {renderItem(t("Status"), String(t(props.status)))}
          </Box>
          <Box sx={{ mr: 0.5 }}>
            {renderItem(t("Count"), String(props.count))}
          </Box>
          <Box sx={{ mr: 0.5 }}>
            {renderItem(t("Rest Count"), String(getRestCount()))}
          </Box>
          <Box sx={{ mr: 0.5 }}>
            {renderItem(t("Remaining"), String(getRemaining()))}
          </Box>
        </Box>
      </Typography>
    </Box>
  );
}

export default Info;

