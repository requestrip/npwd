import { atom } from 'recoil';
import { IEmail } from '../../../../../typings/email';

export const emailState = {
  search: atom<IEmail[]>({
    default: null,
    key: 'EMAIL:search',
  }),
  searchTerm: atom<string>({
    default: null,
    key: 'EMAIL:searchTerm',
  }),
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
