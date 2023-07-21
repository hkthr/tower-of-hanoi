//
// Types
type DiskLayout = {
  source: number[],
  via: number[],
  dest: number[],
}

type Move = {
  sourceNo: number,
  destNo: number,
  length: number,
}

type HanoiContext = {
  length: number,
  layouts: DiskLayout[],
  moves: Move[],
  lastMove: Move | null,
  startTime: number,
  endTime: number,
}

//
// Functions
const getTargetColumn = (diskLayout: DiskLayout, origNo: number): number[] => {
  switch (origNo) {
    case 0:
      return diskLayout.source;
    case 1:
      return diskLayout.via;
    case 2:
      return diskLayout.dest;
    default:
      return [];
  }
}

const moveOne = (source: number[], dest: number[]) => {
  const removed = source.shift();
  if (removed != null) {
    dest.unshift(removed);
  }
}

const hanoi1 = (diskLayout: DiskLayout, moveList: DiskLayout[], sourceNo: number, destNo: number, length: number) => {
  const realSource = getTargetColumn(diskLayout, sourceNo);
  const realDest = getTargetColumn(diskLayout, destNo);
  if (length === 1) {
    moveOne(realSource, realDest);
    moveList.push({ source: diskLayout.source.slice(), via: diskLayout.via.slice(), dest: diskLayout.dest.slice() });
    return;
  }
  const DISK_NUM = 3;
  const viaNo = DISK_NUM - sourceNo - destNo;
  hanoi1(diskLayout, moveList, sourceNo, viaNo, length - 1);
  hanoi1(diskLayout, moveList, sourceNo, destNo, 1);
  hanoi1(diskLayout, moveList, viaNo, destNo, length - 1);
}

const hanoi = (source: number[]): DiskLayout[] => {
  let diskLayout = {
    source: source.slice(),
    via: [],
    dest: [],
  };
  if (source.length === 0) {
    return [];
  }
  let moveList = new Array<DiskLayout>({ source: diskLayout.source.slice(), via: diskLayout.via.slice(), dest: diskLayout.dest.slice() });
  hanoi1(diskLayout, moveList, 0, 2, source.length);

  return moveList;
}

const initHanoiContext = (length: number): HanoiContext => {
  if (length <= 0) {
    throw new Error("Length should be greater than 0");
  }
  let disks = [];
  for (let i = 0; i < length; i++) {
    disks[i] = i + 1;
  }
  return {
    length: length,
    layouts: [{
      source: disks,
      via: [],
      dest: [],
    }],
    moves: [{
      sourceNo: 0,
      destNo: 2,
      length: length
    }],
    lastMove: null,
    startTime: new Date().getTime(),
    endTime: 0,
  };
}

const getNextMove1 = (ctx: HanoiContext): Move | null => {
  let lastMove: Move | undefined = ctx.moves.shift();
  if (lastMove) {
    if (lastMove.length === 1) {
      return lastMove;
    } else { // length > 0
      const viaNo = 3 - lastMove.sourceNo - lastMove.destNo;
      ctx.moves.unshift({ sourceNo: viaNo, destNo: lastMove.destNo, length: lastMove.length - 1 });
      ctx.moves.unshift({ sourceNo: lastMove.sourceNo, destNo: lastMove.destNo, length: 1 });
      ctx.moves.unshift({ sourceNo: lastMove.sourceNo, destNo: viaNo, length: lastMove.length - 1 });
      return getNextMove1(ctx);
    }
  }
  return null;
}

const getNextMove = (ctx: HanoiContext): Move | null => {
  if (ctx.moves.length === 0) {
    return null;
  }
  return getNextMove1(ctx);
}

const getNextLayout = (ctx: HanoiContext): DiskLayout | null => {
  if (ctx.layouts.length === 0) {
    return null;
  }
  const nextMove: Move | null = getNextMove(ctx);
  ctx.lastMove = nextMove;
  if (nextMove == null) {
    return null;
  }
  const lastLayout = ctx.layouts[ctx.layouts.length - 1];
  const nextLayout = {
    source: lastLayout.source.slice(),
    via: lastLayout.via.slice(),
    dest: lastLayout.dest.slice(),
  };
  const realSource = getTargetColumn(nextLayout, nextMove.sourceNo);
  const realDest = getTargetColumn(nextLayout, nextMove.destNo);
  moveOne(realSource, realDest);
  ctx.layouts.push(nextLayout);
  return nextLayout;
}

export type { HanoiContext };
export { hanoi as resolveHanoi, initHanoiContext, getNextLayout, getTargetColumn };
