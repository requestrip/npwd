import { atom } from 'recoil';
import { IEmail } from '../../../common/typings/email';

export const emailState = {
  inbox: atom<IEmail[]>({
    default: null,
    key: 'EMAIL:inbox',
  }),
  sent: atom<IEmail[]>({
    default: null,
    key: 'EMAIL:sent',
  }),
  myEmail: atom<string>({
    default: null,
    key: 'EMAIL:myEmail',
  }),
};
