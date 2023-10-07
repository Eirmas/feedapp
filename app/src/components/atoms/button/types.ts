export enum ButtonThemes {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
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
