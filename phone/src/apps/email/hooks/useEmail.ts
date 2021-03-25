import dayjs from 'dayjs';
import qs from 'qs';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { EmailEvents, EmailMessageInput, IEmailMessage } from '../../../../../typings/email';
import { useNuiEventCallback } from '../../../os/nui-events/hooks/useNuiEventCallback';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';
import { emailState } from './state';

export const useEmail = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();
  const [inbox, setInbox] = useRecoilState(emailState.inbox);
  const myEmail = useRecoilValue(emailState.myEmail);

  const onError = useCallback((error) => addAlert({ message: t(error), type: 'error' }), [
    addAlert,
    t,
  ]);

  const onSendSuccess = useCallback(() => {
    addAlert({ message: t('APPS_EMAIL_SEND_EMAIL_SUCCESS'), type: 'success' });
    history.push('/email');
  }, [addAlert, history, t]);

  const [sendEmail, { loading: sendLoading }] = useNuiEventCallback<EmailMessageInput>(
    'EMAIL',
    EmailEvents.SEND_EMAIL,
    onSendSuccess,
    onError,
  );

  const [fetchInbox, { loading: inboxLoading }] = useNuiEventCallback(
    'EMAIL',
    EmailEvents.FETCH_INBOX,
    setInbox,
    onError,
  );

  const loading = inboxLoading || sendLoading;
  const allEmails = useMemo(() => [...(inbox || [])], [inbox]);

  const head = useCallback((arr: IEmailMessage[]): IEmailMessage => arr && arr[0], []);
  const getEmailById = useCallback((id: number) => allEmails.find((e) => e.id === id) || null, [
    allEmails,
  ]);

  const replyEmail = (message: IEmailMessage & { subject: string }) => {
    const sendDate = dayjs.unix(message.sendDate).format(t('DATE_FORMAT'));
    const receivers = message.receivers.join(',');
    const query = qs.stringify(
      {
        ...message,
        receivers,
        body: ` \n\n ----- On ${sendDate} ${message.sender} wrote: ----- \n\n ${message.body}`,
      },
      { addQueryPrefix: true },
    );
    history.push(`/email/new/${query}`);
  };

  return { inbox, myEmail, getEmailById, head, fetchInbox, sendEmail, replyEmail, loading };
};
