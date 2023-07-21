import { describe, expect, test } from '@jest/globals';
import { cleanup, render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import "../i18n/configs"; //i18
import HanoiAppBar from '../components/AppBar';

afterEach(cleanup);

// Test Tower
describe('render AppBar', () => {
  test('with default setting', () => {
    const { queryByText } = render(
      <RecoilRoot>
        <HanoiAppBar />
      </RecoilRoot>
    );
    
    expect(queryByText("Tower of Hanoi")).toBeTruthy();
    expect(queryByText("Language")).toBeTruthy();
    expect(queryByText("English")).toBeTruthy();
    expect(queryByText("日本語")).toBeTruthy();
  });

});

