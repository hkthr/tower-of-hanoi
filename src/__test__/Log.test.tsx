import React, { useEffect } from 'react';

import { describe, expect, test } from '@jest/globals';
import { cleanup, render, screen } from '@testing-library/react';
import { RecoilRoot, useRecoilState } from 'recoil';

import "../i18n/configs"; //i18
import { logsState, settingsState } from '../common';

import Log from '../components/Log';

afterEach(cleanup);

type SettingSetterProps = {
  time: number,
  message: string,
  children?: React.ReactNode,
};

const SettingsSetter = (props: SettingSetterProps) => {
  const [settings, setSettings] = useRecoilState(settingsState);
  const [logs, setLogs] = useRecoilState(logsState);

  // To execute the test more quickly...
  useEffect(() => {
    setSettings({ ...settings, diskNum: 4, tickDelay: 100 });
    setLogs([{ time: new Date(props.time), message: props.message }, ...logs]);
  }, []);

  return (
    <>
      {props.children}
    </>
  );
}

describe('render Log', () => {
  test('with simple setting', () => {

    const renderLog = (time: number, message: string) => {
      return (
        <SettingsSetter time={time} message={message} >
          <Log />
        </SettingsSetter>
      );
    }

    const { queryByText, getByTestId } = render(
      <RecoilRoot>
        {renderLog(1234, "hello")}
      </RecoilRoot>
    );

    expect(screen.queryByText(/09:00:01.234 hello/)).toBeTruthy();
  });

});

