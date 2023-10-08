export enum ButtonThemes {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
}

export enum ButtonIconModes {
  PREPEND = 'prepend',
  APPEND = 'append',
  FAB = 'fab',
}

export enum ButtonSizes {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum ButtonCorners {
  ROUNDED = 'rounded',
  SQUARE = 'square',
}

export type IButtonThemes = `${ButtonThemes}`;
export type IButtonSizes = `${ButtonSizes}`;
export type IButtonCorners = `${ButtonCorners}`;
export type IButtonIconModes = `${ButtonIconModes}`;
