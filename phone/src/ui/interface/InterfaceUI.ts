import { CSSProperties } from 'react';

export interface AppContentTypes {
  children?: JSX.Element | JSX.Element[];
  paperStyle?: CSSProperties;
  backdrop?: boolean;
  onClickBackdrop?: (...args: any[]) => void;
}

export interface AppWrapperTypes {
  id?: string;
  style?: CSSProperties;
  handleClickAway?: (...args: any[]) => void;
}
