import { describe, expect, test } from '@jest/globals';
import { cleanup, render } from '@testing-library/react';

import Disk from '../components/Disk';

afterEach(cleanup);

// Test Disk
const VIEW_BOX = "0 0 275 275";

describe('render Disk', () => {
  test('with length == 0', () => {
    const length = 0;
    const { queryByText, getByTestId } = render(
      <svg data-testid="svg" xmlns="http://www.w3.org/2000/svg" viewBox={VIEW_BOX} preserveAspectRatio="true">
        <Disk id={0} diskNo={123} mid={137} length={length} top={150} />
      </svg>
    );
    const svg = getByTestId("svg");
    expect(svg).not.toBeNull();
    const text = svg.querySelector("text");
    expect(text).toBeNull();
    expect(queryByText("0")).toBeTruthy();
    expect(queryByText("123")).not.toBeTruthy();
    //    screen.debug();
  });

  test('with length > 0', () => {
    const length = 1;
    const { queryByText, getByTestId } = render(
      <svg data-testid="svg" xmlns="http://www.w3.org/2000/svg" viewBox={VIEW_BOX} preserveAspectRatio="true">
        <Disk id={0} diskNo={123} mid={137} length={length} top={150} />
      </svg>
    );
    const svg = getByTestId("svg");
    expect(svg).not.toBeNull();
    const text = svg.querySelector("text");
    expect(text).not.toBeNull();
    expect(queryByText("123")).toBeTruthy();
  });
});

