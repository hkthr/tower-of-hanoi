import React, { useEffect } from 'react';
import { describe, expect, test } from '@jest/globals';
import { cleanup, render, screen } from '@testing-library/react';
import { RecoilRoot, useRecoilState } from 'recoil';

import "../i18n/configs"; //i18
import { SettingData, settingsState } from '../common';
import Info from '../components/Info';

afterEach(cleanup);

type SettingSetterProps = {
  diskNum: number,
  tickDelay: number,
  children?: React.ReactNode,
};

const SettingsSetter = (props: SettingSetterProps) => {
  const [settings, setSettings] = useRecoilState(settingsState);

  // To execute the test more quickly...
  useEffect(() => {
    setSettings({ ...settings, diskNum: props.diskNum, tickDelay: props.tickDelay });
  }, []);

  return (
    <>
      {props.children}
    </>
  );
}

describe('render Info', () => {
  test('with diskNum:16, tickDelay:100 setting', () => {
    const { queryByText, getByTestId } = render(
      <RecoilRoot>
        <SettingsSetter diskNum={16} tickDelay={100}>
          <Info status={"abcdefgh"} count={1} />
        </SettingsSetter>
      </RecoilRoot>
    );

//    screen.debug();
    expect(queryByText("Info")).toBeTruthy();
    expect(queryByText("DiskNum")).toBeTruthy();
    expect(queryByText("16")).toBeTruthy();
    expect(queryByText("Status")).toBeTruthy();
    expect(queryByText("abcdefgh")).toBeTruthy();
    expect(queryByText("Count")).toBeTruthy();
    expect(queryByText("1")).toBeTruthy();
    expect(queryByText("Rest Count")).toBeTruthy();
    expect(queryByText("65534")).toBeTruthy();
    expect(queryByText("Remaining")).toBeTruthy();
    expect(queryByText(/1\s*hr,\s*49\s*min,\s*13\s*sec/i)).toBeTruthy();
  });

});

