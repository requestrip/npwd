import { useSetRecoilState } from 'recoil';
import { EmailEvents, IEmail } from '../../../../../typings/email';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { emailState } from './state';

export const useEmailService = () => {
  const setMyEmail = useSetRecoilState(emailState.myEmail);

  useNuiEvent('EMAIL', 'phone:setMyEmail', setMyEmail);
};

InjectDebugData<string>([
  {
    app: 'EMAIL',
    method: 'phone:setMyEmail',
    data: 'rocky@projecterror.org',
  },
]);

InjectDebugData<IEmail[]>(
  [
    {
      app: 'EMAIL',
      method: EmailEvents.FETCH_INBOX_SUCCESS,
      data: [
        {
          id: 1,
          subject: 'Hey!',
          messages: [
            {
              id: 1,
              emailId: 1,
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['kidz@projecterror.dev'],
              sender: 'rocky@projecterror.org',
              sendDate: Date.now() / 1000,
              hasActions: false,
            },
          ],
        },
        {
          id: 2,
          subject: 'What is up?',
          messages: [
            {
              id: 2,
              emailId: 2,
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['kidz@projecterror.dev'],
              sender: 'rocky@projecterror.org',
              sendDate: Date.now() / 1000,
              hasActions: false,
            },
          ],
        },
      ],
    },
    {
      app: 'EMAIL',
      method: EmailEvents.FETCH_INBOX_SUCCESS,
      data: [
        {
          id: 3,
          subject: 'Try this great app! 1',
          messages: [
            {
              id: 11,
              parentId: 12,
              emailId: 3,
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['kidz@projecterror.dev'],
              sender: 'rocky@projecterror.org',
              sendDate: Date.now() / 1000,
              isRead: false,
              isMine: true,
              hasActions: false,
            },
            {
              id: 12,
              parentId: 3,
              emailId: 3,
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'kidz@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: false,
              isMine: false,
              hasActions: false,
            },
            {
              id: 3,
              parentId: null,
              emailId: 3,
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['kidz@projecterror.dev'],
              sender: 'rocky@projecterror.org',
              sendDate: Date.now() / 1000,
              isRead: false,
              isMine: true,
              hasActions: false,
            },
          ],
        },
        {
          id: 4,
          subject: 'Try this great app!',
          messages: [
            {
              id: 4,
              emailId: 1,
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'kidz@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: false,
              hasActions: false,
            },
          ],
        },
        {
          id: 5,
          subject: 'Try this great app!',
          messages: [
            {
              id: 5,
              emailId: 5,
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'kidz@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: true,
              hasActions: false,
            },
          ],
        },
        {
          id: 6,
          subject: 'Try this great app!',
          messages: [
            {
              id: 6,
              emailId: 6,
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'chip@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: true,
              hasActions: false,
            },
          ],
        },
        {
          id: 7,
          subject: 'Try this great app!',
          messages: [
            {
              id: 7,
              emailId: 7,
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'taso@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: true,
              hasActions: false,
            },
          ],
        },
        {
          id: 8,
          subject: 'Try this great app!',
          messages: [
            {
              id: 8,
              emailId: 8,
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'kidz@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: false,
              hasActions: false,
            },
          ],
        },
        {
          id: 9,
          subject: 'Try this great app!',
          messages: [
            {
              id: 9,
              emailId: 9,
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'kidz@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: false,
              hasActions: false,
            },
          ],
        },
        {
          id: 10,
          subject: 'Try this great app!',
          messages: [
            {
              id: 10,
              emailId: 10,
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'kidz@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: false,
              hasActions: false,
            },
          ],
        },
      ],
    },
  ],
  4000,
);
