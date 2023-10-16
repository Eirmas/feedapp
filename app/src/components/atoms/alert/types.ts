export enum AlertTypes {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface AlertProps {
  title: string;
  description?: string;
  type: IAlertTypes;
}

export type IAlertTypes = `${AlertTypes}`;
