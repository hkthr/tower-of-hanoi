import React from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from "react-i18next";

import { Button, Tooltip } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { OpeState, OpeAction, getNextState, hanoiOpeState } from '../common';

interface OperationProps {
  name: string,
  action: OpeAction,
  enableStates: OpeState[],
  handler: () => void,
}

const Operation = (props: OperationProps) => {
  const { t } = useTranslation();
  const [opeState, setOpeState] = useRecoilState(hanoiOpeState);

  const handleClick = (name: String) => (event: React.MouseEvent<HTMLElement>) => {
    getNextState(props.action, opeState, setOpeState);
    if (props.handler != null) {
      props.handler();
    }
  };

  const isDisabled = () => {
    if (props.enableStates.includes(opeState)) {
      return false;
    } else {
      return true;
    }
  };

  const renderButton = () => {
    const button = (
      <Button
        variant="contained"
        disabled={isDisabled()}
        onClick={handleClick(props.name)}
        endIcon={<KeyboardArrowRightIcon />}
      >
        {t(props.name)}
      </Button>
    );

    if (isDisabled()) {
      return (
        <span>
          {button}
        </span>
      );
    }
    return button;
  }

  return (
    <Tooltip title={t(props.name)}>
      {renderButton()}
    </Tooltip>
  );
}

export default Operation;
