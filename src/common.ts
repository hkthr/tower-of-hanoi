import { useCallback, RefObject } from 'react';
import { object, number, TypeOf } from 'zod';
import { DateTime, Duration, DurationLikeObject } from "luxon";
import { atom } from 'recoil';

//
// Type
export enum OpeState {
  Initialized = "Initialized",
  Started = "Started",
  Paused = "Paused",
  Finished = "Finished",
}

export enum OpeAction {
  PushStart = "Push:Start",
  PushPause = "Push:Pause",
  PushReset = "Push:Reset",
  ElapsedTime = "Time"
}

type ActionStatePair = {
  action: OpeAction,
  state: OpeState,
}

export type LogEntry = {
  time: Date,
  message: string,
}

const addTransition = (opeTransitionMap: Map<OpeState, Map<OpeAction, OpeState>>, state: OpeState, pairs: ActionStatePair[]) => {
  const actionStateMap = new Map<OpeAction, OpeState>();
  pairs.forEach((pair: ActionStatePair) => {
    actionStateMap.set(pair.action, pair.state);
  });
  opeTransitionMap.set(state, actionStateMap);
}

const opeTransitionMap = new Map<OpeState, Map<OpeAction, OpeState>>();
addTransition(opeTransitionMap, OpeState.Initialized, [{ action: OpeAction.PushStart, state: OpeState.Started }]);
addTransition(opeTransitionMap, OpeState.Started, [
  { action: OpeAction.PushPause, state: OpeState.Paused }, { action: OpeAction.ElapsedTime, state: OpeState.Finished }]);
addTransition(opeTransitionMap, OpeState.Paused, [{ action: OpeAction.PushStart, state: OpeState.Started }]);
addTransition(opeTransitionMap, OpeState.Finished, [{ action: OpeAction.PushReset, state: OpeState.Initialized }]);

export const DEFAULT_LANG = "en";
export const INIT_DISK_LENGTH = 4;
export const MIN_DISK_LENGTH = 1;
export const MAX_DISK_LENGTH = 64;

export const PHASE_TICK_NUM = 1;
export const HANOI_DISK_WIDTH = 4;
export const HANOI_DISK_HEIGHT = 20;
export const HANOI_DISK_GAP = 5;

export const CARD_MIN_WIDTH = 300;
export const CARD_MIN_HEIGHT = 100;
export const CARD_WIDTH = 512;
export const INIT_TICK_DELAY = 400;
export const MIN_TICK_DELAY = 50;
export const MAX_TICK_DELAY = 5000;

export const SettingDataNumberKeyArray = ['diskNum', 'tickDelay'] as const;
export type SettingDataNumberKey = typeof SettingDataNumberKeyArray[number];
export const settingSchema = object({
  diskNum: number().min(MIN_DISK_LENGTH).max(MAX_DISK_LENGTH),
  tickDelay: number().min(MIN_TICK_DELAY).max(MAX_TICK_DELAY),
});
export type SettingData = TypeOf<typeof settingSchema>;

export const getDefaultSetting = () => {
  return {
    diskNum: INIT_DISK_LENGTH,
    tickDelay: INIT_TICK_DELAY,
  };
}

export const logsState = atom({
  key: 'logsState',
  default: new Array<LogEntry>(),
});

export const settingsState = atom({
  key: 'settingsState',
  default: getDefaultSetting(),
});

export const hanoiOpeState = atom({
  key: 'hanoiOpeState',
  default: OpeState.Initialized,
});

export const langState = atom({
  key: 'langState',
  default: DEFAULT_LANG,
});

//
// Common function
export const getNextState = (action: OpeAction, hanoiState: OpeState, setHanoiState: (nextState: OpeState) => void) => {
  const actionMap: Map<OpeAction, OpeState> | undefined = opeTransitionMap.get(hanoiState);
  var nextState: OpeState | undefined = undefined;
  if (actionMap) {
    nextState = actionMap.get(action);
    if (nextState) {
      setHanoiState(nextState);
    }
  }
  return nextState;
}

export const capitalize = (str: string) => str.slice(0, 1).toUpperCase() + str.slice(1);

export const getDurationFromSeconds = (seconds: number, language: string) => {

  const orderedUnits = [
    "years",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
    "milliseconds",
  ];
  const dur = Duration.fromObject({ seconds: seconds }).rescale();
  const units = orderedUnits
    .map((unit) => {
      const val = dur.get(unit as keyof DurationLikeObject);
      if (!val) {
        return "";
      }
      return new Intl.NumberFormat(language, { style: 'unit', unit: unit.slice(0, -1) }).format(val);
    })
    .filter((n) => n);
  return new Intl.ListFormat(language, { style: 'long', type: 'unit' }).format(units ?? []);
}

export const formatTime = (time: number, options: any={}) => {
  return DateTime.fromMillis(time, options).toFormat("HH:mm:ss.SSS");
}

// Thanx to match35
//   https://zenn.dev/tm35/articles/7ac0a932c15ef8
// 引数のtargetProperty をDOMRectのもつPropertyに限定する
type DOMRectProperty = keyof Omit<DOMRect, 'toJSON'>;

// RefObjectの型は div, span, p, input などのさまざまなHTML要素に対応できるようにextendsで制限をかけつつ抽象化
export const useGetElementProperty = <T extends HTMLElement>(
  elementRef: RefObject<T>
) => {
  const getElementProperty = useCallback(
    (targetProperty: DOMRectProperty): number => {
      const clientRect = elementRef.current?.getBoundingClientRect();
      if (clientRect) {
        return clientRect[targetProperty];
      }

      // clientRect が undefined のときはデフォルトで0を返すようにする
      return 0;
    },
    [elementRef]
  );

  return {
    getElementProperty,
  };
};