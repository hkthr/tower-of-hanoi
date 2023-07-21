import { describe, expect, jest, test } from '@jest/globals';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';

import "../i18n/configs"; //i18
import { SettingData, getDefaultSetting } from '../common';
import Dialog from '../components/Dialog';

beforeEach(() => {});
afterEach(cleanup);

describe('render Dialog', () => {
  test('with not open setting', () => {
    const settingData: SettingData = {
      diskNum: 0,
      tickDelay: 0,
    };
    const { queryByText, getByTestId } = render(
      <Dialog open={false} onClose={jest.fn()} onSave={jest.fn()} settingData={settingData} />
    );
    expect(queryByText("Settings")).not.toBeTruthy();
    expect(queryByText("DiskNum")).not.toBeTruthy();
    expect(queryByText("TickDelay")).not.toBeTruthy();
  });

  test('with open setting', () => {
    const settingData: SettingData = {
      diskNum: 32,
      tickDelay: 200,
    };
    const { queryByText, getByTestId } = render(
      <Dialog open={true} onClose={jest.fn()} onSave={jest.fn()} settingData={settingData} />
    );
    expect(queryByText("Settings")).toBeTruthy();
    expect(queryByText("DiskNum")).toBeTruthy();
    expect(screen.queryByLabelText(/DiskNum/, { selector: 'input' })).toHaveProperty("value", "32");
    expect(queryByText("TickDelay")).toBeTruthy();
    expect(screen.queryByLabelText(/TickDelay/, { selector: 'input' })).toHaveProperty("value", "200");
    expect(screen.getByRole('button', { name: 'OK' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
    //    screen.debug();
  });
});

const defaultSetting: SettingData = getDefaultSetting();

describe('validation', () => {
  const testData = {
    diskNum: [
      { value: 0, message: 'Number must be greater than or equal to 1' },
      { value: 65, message: 'Number must be less than or equal to 64' }
    ],
    tickDelay: [
      { value: 49, message: 'Number must be greater than or equal to 50' },
      { value: 5001, message: 'Number must be less than or equal to 5000' }
    ],
  };
  test.each(testData.diskNum)('diskNum is out of range', async ({ value, message }) => {
    const setting: SettingData = { ...defaultSetting, diskNum: value };
    render(
      <Dialog
        open={true}
        onClose={jest.fn()}
        onSave={jest.fn()}
        settingData={setting}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(screen.queryByText(message)).toBeTruthy();
    });
  });
  test.each(testData.tickDelay)('tickDelay is out of range', async ({ value, message }) => {
    const setting: SettingData = { ...defaultSetting, tickDelay: value };
    render(
      <Dialog
        open={true}
        onClose={jest.fn()}
        onSave={jest.fn()}
        settingData={setting}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(screen.queryByText(message)).toBeTruthy();
    });
  });
});
