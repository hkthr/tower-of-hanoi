import React, { useEffect } from 'react';
import { useForm, SubmitHandler, UseFormRegister, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Dialog, DialogContent, DialogTitle,
  TextField,
} from '@mui/material';

import { SettingData, settingSchema, SettingDataNumberKey, capitalize } from "../common";

interface DialogProps {
  open: boolean;
  settingData: SettingData,
  onClose: () => void;
  onSave: (settingData: SettingData) => void;
}

interface NumberTextFieldProps {
  name: SettingDataNumberKey,
  errors: FieldError | undefined,
  register: UseFormRegister<SettingData>,
}

const NumberTextField = (props: NumberTextFieldProps) => {
  const { name, errors, register } = props;
  const { t } = useTranslation();

  const getErrorMessage = () => {
    return errors ? errors.message : '';
  }

  return (
    <TextField
      required
      error={!!errors}
      sx={{ pl: 0.5 }}
      margin="dense"
      label={t(capitalize(name))}
      variant="outlined"
      type="number"
      helperText={getErrorMessage()}
      style={{ width: 200 }}
      {...register(name, { valueAsNumber: true })}
    />
  );
}
const AppDialog = (props: DialogProps) => {
  const { open, onClose, onSave, settingData } = props;
  const { t } = useTranslation();
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
    getValues,
  } = useForm<SettingData>({
    mode: 'onBlur',
    resolver: zodResolver(settingSchema),
    defaultValues: settingData,
  });

  const handleCancel = () => {
    reset();
    handleClose();
  }

  const handleClose = () => {
    onClose();
  };

  const onSubmitHandler: SubmitHandler<SettingData> = (values: SettingData) => {
    onSave(values);
    onClose();
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(getValues());
    }
  }, [isSubmitSuccessful, reset, getValues]);

  const DialogTab = (props: any) => {
    return (
      <Box sx={{ p: 1, m: 0, width: 480, height: 260 }}>
        {props.children}
      </Box>
    );
  }

  return (
    <Box>
      <Dialog open={open} onClose={handleClose} sx={{ p: 0, m: 0 }}>
        <DialogTitle>
          {t("Settings")}
        </DialogTitle>
        <DialogContent sx={{ p: 0, m: 0, }}>
          <form onSubmit={handleSubmit(onSubmitHandler)} >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box>
                <DialogTab>
                  <NumberTextField name={'diskNum'} errors={errors['diskNum']} register={register} />
                  <NumberTextField name={'tickDelay'} errors={errors['tickDelay']} register={register} />
                </DialogTab>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', p: 1, m: 1, justifyContent: 'flex-end' }}>
                  <Button sx={{ p: 1, m: 1 }} type="submit">{t("OK")}</Button>
                  <Button sx={{ p: 1, m: 1 }} onClick={handleCancel} autoFocus>{t("Cancel")}</Button>
                </Box>

              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );

}

export default AppDialog;
