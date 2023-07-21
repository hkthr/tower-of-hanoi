import { describe, expect, test } from '@jest/globals';
import { capitalize, getDurationFromSeconds, formatTime, getNextState, OpeAction, OpeState } from '../common';

// Test Common Functions
describe('Common Functions', () => {
  test('capitalize ', () => {
    expect(capitalize("abc")).toEqual("Abc");
    expect(capitalize("123")).toEqual("123");
  });

  test('getDurationFromSeconds', () => {
    expect(getDurationFromSeconds(1, "en")).toEqual("1 sec");
    expect(getDurationFromSeconds(123, "en")).toEqual("2 min, 3 sec");
  });

  test('formatTime', () => {
    expect(formatTime(1689847400456, {zone: "UTC"})).toEqual("10:03:20.456");
    expect(formatTime(123, {zone: "UTC"})).toEqual("00:00:00.123");
  });
});

type OpeStateAction = {
  curState: OpeState,
  curAction: OpeAction,
  expectedState?: OpeState,
}

describe('getNextState', () => {
  const testOpeStateActionList: OpeStateAction[] = [
    { curState: OpeState.Initialized, curAction: OpeAction.PushStart, expectedState: OpeState.Started },
    { curState: OpeState.Initialized, curAction: OpeAction.PushPause, expectedState: undefined },
    { curState: OpeState.Initialized, curAction: OpeAction.PushReset, expectedState: undefined },
    { curState: OpeState.Initialized, curAction: OpeAction.ElapsedTime, expectedState: undefined },
    { curState: OpeState.Started, curAction: OpeAction.PushStart, expectedState: undefined },
    { curState: OpeState.Started, curAction: OpeAction.PushPause, expectedState: OpeState.Paused },
    { curState: OpeState.Started, curAction: OpeAction.PushReset, expectedState: undefined },
    { curState: OpeState.Started, curAction: OpeAction.ElapsedTime, expectedState: OpeState.Finished },
    { curState: OpeState.Paused, curAction: OpeAction.PushStart, expectedState: OpeState.Started },
    { curState: OpeState.Paused, curAction: OpeAction.PushPause, expectedState: undefined },
    { curState: OpeState.Paused, curAction: OpeAction.PushReset, expectedState: undefined },
    { curState: OpeState.Paused, curAction: OpeAction.ElapsedTime, expectedState: undefined },
    { curState: OpeState.Finished, curAction: OpeAction.PushStart, expectedState: undefined },
    { curState: OpeState.Finished, curAction: OpeAction.PushPause, expectedState: undefined },
    { curState: OpeState.Finished, curAction: OpeAction.PushReset, expectedState: OpeState.Initialized },
    { curState: OpeState.Finished, curAction: OpeAction.ElapsedTime, expectedState: undefined },
  ];

  test.each(testOpeStateActionList)('given %p and %p as arguments, returns %p', ({ curState, curAction, expectedState }: OpeStateAction) => {
    const mockMethod = jest.fn();
    const nextState = getNextState(curAction, curState, mockMethod);
    expect(nextState).toEqual(expectedState);
    expect(mockMethod.mock.calls.length).toEqual(expectedState ? 1 : 0);
  });
});