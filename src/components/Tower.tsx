import React, { ReactElement, useRef, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from "react-i18next";

import { Box, Card, Typography } from '@mui/material';

import Disk from './Disk';
import { HANOI_DISK_HEIGHT, HANOI_DISK_GAP, CARD_WIDTH, CARD_MIN_WIDTH, CARD_MIN_HEIGHT, settingsState, useGetElementProperty } from '../common';

const NAME_HEIGHT = 32;

interface TowerProps {
  name: string,
  disks: number[],
}

const Tower = (props: TowerProps) => {
  const targetRef = useRef(null);
  const { getElementProperty } =
    useGetElementProperty<HTMLDivElement>(targetRef);
  const { t } = useTranslation();
  const [settings] = useRecoilState(settingsState);

  const HanoiDiskTotalHeight = HANOI_DISK_HEIGHT + HANOI_DISK_GAP;
  const pathTop = HanoiDiskTotalHeight;
  const pathBottom = pathTop + (settings.diskNum) * HanoiDiskTotalHeight;

  const getPath = (cardWidth: number, pathBottom: number) => {
    return `M ${cardWidth / 2},${pathTop} L ${cardWidth / 2},${pathTop + pathBottom + HANOI_DISK_GAP * 2}`;
  }

  const getViewBoxHeight = () => {
    return Math.max(pathTop + HanoiDiskTotalHeight * settings.diskNum + HANOI_DISK_GAP * 3, CARD_MIN_HEIGHT);
  }

  const [viewBox, setViewBox] = useState<string>(`0 0 ${CARD_WIDTH} ${CARD_MIN_HEIGHT}`);
  const [path, setPath] = useState<string>(getPath(CARD_WIDTH, pathBottom));
  const [mid, setMid] = useState<number>(CARD_WIDTH / 2);
  const [cardHeight, setCardHeight] = useState<number>(getViewBoxHeight() + NAME_HEIGHT);

  useEffect(() => {
    const cardWidth = getElementProperty("width");
    setViewBox(`0 0 ${cardWidth} ${CARD_MIN_HEIGHT}`);
    setMid(cardWidth / 2);
  }, []);

  useEffect(() => {
    const cardWidth = getElementProperty("width");
    const viewBoxHeight = getViewBoxHeight();
    const pathBottom = (HanoiDiskTotalHeight) * settings.diskNum;
    const newPath = getPath(cardWidth, pathBottom);
    setPath(newPath);
    setViewBox(`0 0 ${cardWidth} ${viewBoxHeight}`);
    const cardHeight = viewBoxHeight + NAME_HEIGHT + 4;
    setCardHeight(cardHeight);
  }, [settings.diskNum]);

  let diskElems: ReactElement[] = [];
  for (let i = 0; i < settings.diskNum; i++) {
    let pos = props.disks.length - settings.diskNum + i;
    let length = (pos >= 0 && props.disks[pos] != null) ? props.disks[pos] : 0;
    diskElems[i] = <Disk length={length} mid={mid} key={props.name + i} id={i + 1} diskNo={props.disks[pos]} top={i * HanoiDiskTotalHeight} />;
  }
  // old bgcolor: '#77ff77','#ffcccc'
  return (
    <>
      <Card sx={{ minWidth: CARD_MIN_WIDTH, width: CARD_WIDTH, minHeight: CARD_MIN_HEIGHT, height: cardHeight }} ref={targetRef}>
        <Box sx={{ pl: 1, pt: 1, display: "flex" }}>
          <Box sx={{ height: NAME_HEIGHT }}>
            <Typography sx={{ fontSize: 14, fontWeight: 'bold', color:'white',bgcolor: 'secondary.main', pl: 0.8, pr: 0.8 }} gutterBottom>
              {t(props.name)}
            </Typography>
          </Box>
        </Box>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} preserveAspectRatio="true">
          {diskElems}
          <path fill="none" stroke="red" d={path} />
        </svg>
      </Card>
      <Box sx={{ ml: 2 }} />
    </>
  );
}

export default Tower;
