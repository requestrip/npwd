import { useCallback, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IEmailMessage } from '../../../common/typings/email';
import { useNuiEventCallback } from '../../../os/nui-events/hooks/useNuiEventCallback';
import { emailState } from './state';

export const useEmail = () => {
  const [inbox, setInbox] = useRecoilState(emailState.inbox);
  const [sent, setSent] = useRecoilState(emailState.sent);
  const myEmail = useRecoilValue(emailState.myEmail);

  const [fetchInbox, { loading: inboxLoading }] = useNuiEventCallback(
    'EMAIL',
    'phone:fetchInbox',
    setInbox,
  );
  const [fetchSent, { loading: sentLoading }] = useNuiEventCallback(
    'EMAIL',
    'phone:fetchSentEmails',
    setSent,
  );

  const loading = inboxLoading || sentLoading;
  const allEmails = useMemo(() => [...(sent || []), ...(inbox || [])], [inbox, sent]);

  const head = useCallback((arr: IEmailMessage[]): IEmailMessage => arr && arr[0], []);
  const getEmailById = useCallback((id: number) => allEmails.find((e) => e.id === id) || null, [
    allEmails,
  ]);

  return { inbox, sent, myEmail, getEmailById, head, fetchSent, fetchInbox, loading };
};
