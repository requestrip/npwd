import { useSetRecoilState } from 'recoil';
import { IEmail } from '../../../common/typings/email';
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
      method: 'phone:fetchSentEmailsSuccess',
      data: [
        {
          id: 1,
          messages: [
            {
              id: 1,
              emailId: 1,
              subject: 'Hey!',
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['kidz@projecterror.dev'],
              sender: 'rocky@projecterror.org',
              sendDate: Date.now() / 1000,
            },
          ],
        },
        {
          id: 2,
          messages: [
            {
              id: 2,
              emailId: 2,
              subject: 'What is up?',
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['kidz@projecterror.dev'],
              sender: 'rocky@projecterror.org',
              sendDate: Date.now() / 1000,
            },
          ],
        },
      ],
    },
    {
      app: 'EMAIL',
      method: 'phone:fetchEmailsSuccess',
      data: [
        {
          id: 3,
          messages: [
            {
              id: 11,
              parentId: 12,
              emailId: 3,
              subject: 'Try this great app! 1',
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['kidz@projecterror.dev'],
              sender: 'rocky@projecterror.org',
              sendDate: Date.now() / 1000,
              isRead: false,
              isMine: true,
            },
            {
              id: 12,
              parentId: 3,
              emailId: 3,
              subject: 'Try this great app! 2',
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'kidz@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: false,
              isMine: false,
            },
            {
              id: 3,
              parentId: null,
              emailId: 3,
              subject: 'Try this great app! 3',
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['kidz@projecterror.dev'],
              sender: 'rocky@projecterror.org',
              sendDate: Date.now() / 1000,
              isRead: false,
              isMine: true,
            },
          ],
        },
        {
          id: 4,
          messages: [
            {
              id: 4,
              emailId: 1,
              subject: 'Try this great app!',
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'kidz@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: false,
            },
          ],
        },
        {
          id: 5,
          messages: [
            {
              id: 5,
              emailId: 5,
              subject: 'Try this great app!',
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'kidz@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: true,
            },
          ],
        },
        {
          id: 6,
          messages: [
            {
              id: 6,
              emailId: 6,
              subject: 'Try this great app!',
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'chip@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: true,
            },
          ],
        },
        {
          id: 7,
          messages: [
            {
              id: 7,
              emailId: 7,
              subject: 'Try this great app!',
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'taso@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: true,
            },
          ],
        },
        {
          id: 8,
          messages: [
            {
              id: 8,
              emailId: 8,
              subject: 'Try this great app!',
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'kidz@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: false,
            },
          ],
        },
        {
          id: 9,
          messages: [
            {
              id: 9,
              emailId: 9,
              subject: 'Try this great app!',
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'kidz@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: false,
            },
          ],
        },
        {
          id: 10,
          messages: [
            {
              id: 10,
              emailId: 10,
              subject: 'Try this great app!',
              body: 'Hey did you try this email app? Looking good bruh',
              receivers: ['rocky@projecterror.org'],
              sender: 'kidz@projecterror.dev',
              sendDate: Date.now() / 1000,
              isRead: false,
            },
          ],
        },
      ],
    },
  ],
  4000,
);
