import { atom } from 'recoil';
import { IEmail } from '../../../common/typings/email';

export const emailState = {
  emails: atom<IEmail[]>({
    default: null,
    key: 'EMAIL:emails',
  }),
};
