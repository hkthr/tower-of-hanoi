import React from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from "react-i18next";

import { Box, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';

import { langState } from '../common';

const languages = [
  { name: "English", code: "en" },
  { name: "日本語", code: "ja" },
];

interface HanoiAppBarProps {
}

const HanoiAppBar = (props: HanoiAppBarProps) => {
  const { t } = useTranslation();
  const [language, setLanguage] = useRecoilState(langState);

  const handleLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = event.target.value;
    setLanguage(lang);
  };

  return (
    <Box data-testid="hanoiBar">
      <AppBar position="static" sx={{ p: 1, pl: 2, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between" }} >
        <Box >
          <Typography component={'div'} variant="h5">
            {t("Tower of Hanoi")}
          </Typography>
        </Box>
        <Box sx={{ alignSelf: 'flex-end' }}>
          <span>{t("Language")}</span>{" "}
          <select onChange={handleLangChange}>
            {languages.map(({ name, code }) => (
              <option key={code} value={code} defaultValue={language}>
                {name}
              </option>
            ))}
          </select>
        </Box>
      </AppBar>
    </Box>
  );
}

export default HanoiAppBar;
