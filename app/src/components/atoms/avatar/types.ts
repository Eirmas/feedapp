export enum AvatarSizes {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum AvatarStates {
  OFFLINE = 'offline',
  ONLINE = 'online',
  IDLE = 'idle',
}

export type IAvatarSizes = `${AvatarSizes}`;
export type IAvatarStates = `${AvatarStates}`;