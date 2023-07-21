import { describe, expect, test } from '@jest/globals';
import { cleanup, render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import "../i18n/configs"; //i18
import Tower from '../components/Tower';

afterEach(cleanup);

// Test Tower
describe('render Tower', () => {
  test('with length == 1', () => {
    const disks = [1];
    const { queryByText, getByTestId } = render(
      <RecoilRoot>
        <Tower name={"myTower"} disks={disks} />
      </RecoilRoot>
    );

    expect(queryByText("myTower")).toBeTruthy();
    const svgList: NodeListOf<SVGSVGElement> = document.querySelectorAll("svg");
    expect(svgList).not.toBeNull();
    expect(svgList.length).toBe(1);
    const rectList: NodeListOf<SVGRectElement> = svgList[0]?.querySelectorAll("rect[width]:not([width='0'])");
    expect(rectList).not.toBeNull();
    expect(rectList.length).toBe(1);
    const textList: NodeListOf<SVGTextElement> = svgList[0]?.querySelectorAll("text");
    expect(textList).not.toBeNull();
    expect(textList.length).toBe(1);
    //    screen.debug();
  });

  test('with length == 2', () => {
    const disks = [1, 2];
    const { queryByText, getByTestId } = render(
      <RecoilRoot>
        <Tower name={"myTower"} disks={disks} />
      </RecoilRoot>
    );
    expect(queryByText("myTower")).toBeTruthy();
    const svgList: NodeListOf<SVGSVGElement> = document.querySelectorAll("svg");
    expect(svgList).not.toBeNull();
    expect(svgList.length).toBe(1);
    const rectList: NodeListOf<SVGRectElement> = svgList[0]?.querySelectorAll("rect[width]:not([width='0'])");
    expect(rectList).not.toBeNull();
    expect(rectList.length).toBe(2);
    const textList: NodeListOf<SVGTextElement> = svgList[0]?.querySelectorAll("text");
    expect(textList).not.toBeNull();
    expect(textList.length).toBe(2);
  });

});

