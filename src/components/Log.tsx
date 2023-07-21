import React from 'react';
import { useRecoilState } from 'recoil';

import { Box, ListItem, ListItemText } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import { formatTime, logsState } from "../common";

const LOG_FONT_SIZE = 12;
const LOG_FONT_WEIGHT = 'medium';

interface LogProps {
}

const Log = (props: LogProps) => {
  const [logs] = useRecoilState(logsState);

  const formatLogText = (time: Date, text: string) => {
    return `${formatTime(time.getTime())} ${text}`;;
  }

  function renderRow(props: ListChildComponentProps) {
    const { index, style } = props;

    return (
      <ListItem style={style} key={`item-${index}`} component="div" sx={{ p: 0, pl: 0.5 }}>
        <ListItemText
          sx={{ m: 0 }}
          primary={(logs.length > 0 && logs[index].time) ? formatLogText(logs[index].time, logs[index].message) : "InitialText"}
          primaryTypographyProps={{ fontSize: LOG_FONT_SIZE, fontWeight: LOG_FONT_WEIGHT }}
        />
      </ListItem>
    );
  }

  return (
    <Box sx={{ p: 0, width: '100%', boxShadow: 1, }} data-testid="hanoiLog">
      <FixedSizeList
        height={150}
        width="100%"
        itemSize={20}
        itemCount={logs.length}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </Box>
  );

};

export default Log;