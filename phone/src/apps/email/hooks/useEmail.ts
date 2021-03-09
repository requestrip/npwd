import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { IEmail } from '../../../common/typings/email';
import { emailState } from './state';

export const useEmail = () => {
  const inbox = useRecoilValue(emailState.inbox);
  const sent = useRecoilValue(emailState.sent);
  const myEmail = useRecoilValue(emailState.myEmail);

  const allEmails = useMemo(() => [...(sent || []), ...(inbox || [])], [inbox, sent]);

  const isMine = (email: IEmail) => email.sender === myEmail;

  const getEmailById = (id: number) => allEmails.find((e) => e.id === id) || null;

  return { inbox, sent, myEmail, isMine, getEmailById };
};
