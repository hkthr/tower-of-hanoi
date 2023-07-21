import React from 'react';
import { useTheme } from '@mui/material/styles';

import { HANOI_DISK_HEIGHT, HANOI_DISK_WIDTH } from '../common';

interface DiskProps {
  id: number,
  diskNo: number,
  mid: number,
  length: number,
  top: number,
}

const TEXT_COLOR = "white";
const TEXT_POS_X_DELTA1 = 4;
const TEXT_POS_X_DELTA2 = 10;

const Disk = (props: DiskProps) => {
  const width = props.length * HANOI_DISK_WIDTH * 2 + (props.length > 0 ? HANOI_DISK_WIDTH : 0);
  const rectX = (props.mid - width / 2);
  const rectY = props.top + 35;
  const textX = props.mid - (props.diskNo < 10 ? TEXT_POS_X_DELTA1 : TEXT_POS_X_DELTA2);
  const textY = rectY + HANOI_DISK_WIDTH / 2 + 12;
  const theme = useTheme();
  const diskColor = theme.palette.primary.light;

  return (
    <>
      <rect x={rectX} y={rectY} width={width} height={HANOI_DISK_HEIGHT} fill={diskColor}>
      </rect>
      {width &&
        <text x={textX} y={textY} fill={TEXT_COLOR}>
          {props.diskNo}
        </text>
      }
    </>
  );

}

export default Disk;
