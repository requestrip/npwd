import { useSetRecoilState } from 'recoil';
import { IEmail } from '../../../common/typings/email';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { emailState } from './state';

export const useEmailService = () => {
  const setEmails = useSetRecoilState(emailState.emails);

  useNuiEvent('EMAIL', 'phone:fetchAllEmailsSuccess', setEmails);
};

InjectDebugData<IEmail[]>([
  {
    app: 'EMAIL',
    method: 'phone:fetchAllEmailsSuccess',
    data: [
      {
        id: 1,
        subject: 'Try this great app!',
        body: 'Hey did you try this email app? Looking good bruh',
        receivers: ['rocky@projecterror.org'],
        sender: 'kidz@projecterror.org',
        sendDate: Date.now() / 1000,
        isRead: false,
      },
      {
        id: 2,
        subject: 'Try this great app!',
        body: 'Hey did you try this email app? Looking good bruh',
        receivers: ['rocky@projecterror.org'],
        sender: 'kidz@projecterror.org',
        sendDate: Date.now() / 1000,
        isRead: false,
      },
      {
        id: 3,
        subject: 'Try this great app!',
        body: 'Hey did you try this email app? Looking good bruh',
        receivers: ['rocky@projecterror.org'],
        sender: 'kidz@projecterror.org',
        sendDate: Date.now() / 1000,
        isRead: true,
      },
      {
        id: 4,
        subject: 'Try this great app!',
        body: 'Hey did you try this email app? Looking good bruh',
        receivers: ['rocky@projecterror.org'],
        sender: 'chip@projecterror.org',
        sendDate: Date.now() / 1000,
        isRead: true,
      },
      {
        id: 5,
        subject: 'Try this great app!',
        body: 'Hey did you try this email app? Looking good bruh',
        receivers: ['rocky@projecterror.org'],
        sender: 'taso@projecterror.org',
        sendDate: Date.now() / 1000,
        isRead: true,
      },
      {
        id: 6,
        subject: 'Try this great app!',
        body: 'Hey did you try this email app? Looking good bruh',
        receivers: ['rocky@projecterror.org'],
        sender: 'kidz@projecterror.org',
        sendDate: Date.now() / 1000,
        isRead: false,
      },
      {
        id: 7,
        subject: 'Try this great app!',
        body: 'Hey did you try this email app? Looking good bruh',
        receivers: ['rocky@projecterror.org'],
        sender: 'kidz@projecterror.org',
        sendDate: Date.now() / 1000,
        isRead: false,
      },
      {
        id: 8,
        subject: 'Try this great app!',
        body: 'Hey did you try this email app? Looking good bruh',
        receivers: ['rocky@projecterror.org'],
        sender: 'kidz@projecterror.org',
        sendDate: Date.now() / 1000,
        isRead: false,
      },
    ],
  },
]);
