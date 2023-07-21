import React from 'react';

import { describe, expect, jest, test } from '@jest/globals';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import "../i18n/configs"; //i18
import { OpeState, OpeAction } from '../common';

import Operation from '../components/Operation';

afterEach(cleanup);

describe('render Operation', () => {
  test('with Start button', () => {

    const mockCallBack = jest.fn();
    const { queryByText, getByTestId } = render(
      <RecoilRoot>
        <Operation name="Start" action={OpeAction.PushStart} enableStates={[OpeState.Initialized, OpeState.Paused]} handler={mockCallBack} />
      </RecoilRoot>
    );
    expect(screen.getByRole('button', { name: 'Start' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Start' })).toHaveProperty("disabled", false);

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));

    expect(screen.getByRole('button', { name: 'Start' })).toHaveProperty("disabled", true);
    expect(mockCallBack.mock.calls.length).toEqual(1);
//    screen.debug();

  });

});

