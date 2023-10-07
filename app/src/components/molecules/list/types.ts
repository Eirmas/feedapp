import { RouteLocationRaw } from 'vue-router';
import { FunctionalIcon } from '../../../types';

export type IListLines = 1 | 2 | 3;

export type IListSubheader = {
  type: 'subheader';
  title?: string;
};

export type IListDivider = {
  type: 'divider';
};

export type IListItem = {
  title?: string;
  prependIcon?: FunctionalIcon;
  appendIcon?: FunctionalIcon;
  prependAvatar?: string;
  appendAvatar?: string;
  value?: unknown;
  subtitle?: string;
  click?: (event: MouseEvent | KeyboardEvent) => void;
  dense?: boolean;
  disabled?: boolean;
  lines?: IListLines;
  to?: RouteLocationRaw;
  replace?: boolean;
  href?: string;
  targetBlank?: boolean;
  selected?: boolean;
};

export type IListGroup = {
  value: unknown;
  title?: string;
  prependIcon?: FunctionalIcon;
  appendAvatar?: string;
  dense?: boolean;
  disabled?: boolean;
  items?: IListItems;
  open?: boolean;
};

export type IListItems = Array<IListGroup | IListSubheader | IListDivider | IListItem>;
