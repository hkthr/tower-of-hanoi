import { describe, expect, test } from '@jest/globals';
import { resolveHanoi as hanoi, initHanoiContext, getNextLayout, getTargetColumn } from '../hanoi';

// Test resolveHanoi
describe('run resolveHanoi', () => {
  test('with size 0', () => {
    const moveList = hanoi([]);
    expect(moveList).toHaveLength(0);
  });
  test('with size 1', () => {
    const expected = [
      { source: [1], via: [], dest: [] },
      { source: [], via: [], dest: [1] },
    ];
    const moveList = hanoi([1]);
    expect(moveList).toHaveLength(2);
    expect(moveList).toEqual(expected);
  });
  test('with size 2', () => {
    const expected = [
      { source: [1, 2], via: [], dest: [] },
      { source: [2], via: [1], dest: [] },
      { source: [], via: [1], dest: [2] },
      { source: [], via: [], dest: [1, 2] },
    ];
    const moveList = hanoi([1, 2]);
    expect(moveList).toHaveLength(4);
    expect(moveList).toEqual(expected);
  });
});

// Test initHanoiContext
describe('run initHanoiContext', () => {
  test('with size 0, error should be occurred', () => {
    expect(() => {
      const ctx = initHanoiContext(0);
    }).toThrow();
  });
  test('with size 1', () => {
    const ctx = initHanoiContext(1);
    expect(ctx).not.toBeNull();
    expect(ctx.length).toEqual(1);
    expect(ctx.layouts).toHaveLength(1);
    expect(ctx.moves).toHaveLength(1);
    expect(ctx.lastMove).toBeNull();
    expect(ctx.startTime).not.toBeNull();
  });
  test('with size 10', () => {
    const ctx = initHanoiContext(10);
    expect(ctx).not.toBeNull();
    expect(ctx.length).toEqual(10);
    expect(ctx.layouts).toHaveLength(1);
    expect(ctx.moves).toHaveLength(1);
    expect(ctx.lastMove).toBeNull();
    expect(ctx.startTime).not.toBeNull();
  });
});

// Test getNextLayout
describe('run getNextLayout', () => {
  test('with size 1', () => {
    const ctx = initHanoiContext(1);
    const nextLayout = getNextLayout(ctx);
    expect(nextLayout).not.toBeNull();
    expect(nextLayout).toEqual({ source: [], via: [], dest: [1] });
  });
  test('with size 10', () => {
    const ctx = initHanoiContext(10);
    const nextLayout = getNextLayout(ctx);
    expect(nextLayout).not.toBeNull();
    expect(nextLayout).toEqual({ source: [2, 3, 4, 5, 6, 7, 8, 9, 10], via: [1], dest: [] });
  });
});

// Test getTargetColumn
describe('run getTargetColumn', () => {
  test('with all pattern', () => {
    const nextLayout = {
      source: [1, 2],
      via: [3, 4],
      dest: [5, 6],
    };
    const sourceColumns = getTargetColumn(nextLayout, 0);
    expect(sourceColumns).toEqual([1, 2]);
    const viaColumns = getTargetColumn(nextLayout, 1);
    expect(viaColumns).toEqual([3, 4]);
    const destColumns = getTargetColumn(nextLayout, 2);
    expect(destColumns).toEqual([5, 6]);
  });
});
