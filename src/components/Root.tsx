import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { RecoilRoot, useRecoilState } from 'recoil';

import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import HanoiAppBar from './AppBar';
import Content from './Content';
import { TimerProvider } from "./TimerContext";
import { langState } from '../common';

const MainView = () => {
  const { i18n } = useTranslation();
  const [language] = useRecoilState(langState);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <Grid container className="mainPanel">
      <Grid item xs={12} >
        <HanoiAppBar />
      </Grid>
      <Grid item xs={12}>
        <Content />
      </Grid>
    </Grid>
  );
};

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

const Root = () => {

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <TimerProvider>
          <MainView />
        </TimerProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default Root;
