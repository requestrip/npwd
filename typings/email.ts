export interface IEmailPhoneAction {
  path: string;
}

export interface IEmailExternalAction {
  eventName: string;
  args: Array<string | number>;
  closePhone?: boolean;
}

export interface IEmailMessage {
  id: number;
  parentId?: number | null;
  emailId: number;
  isRead?: boolean;
  isMine?: boolean;
  receivers: string[];
  sender: string;
  sendDate: number;
  body: string;
  phoneActions?: Array<IEmailPhoneAction>;
  externalActions?: Array<IEmailExternalAction>;
}

export interface IEmail {
  id: number;
  subject: string;
  messages: IEmailMessage[];
}

export interface EmailMessageInput {
  email_id?: number;
  subject?: string;
  parent_id?: number;
  body: string;
  receivers: string;
}

export enum EmailEvents {
  FETCH_INBOX = 'npwd:fetchEmailInbox',
  FETCH_INBOX_SUCCESS = 'npwd:fetchEmailInboxSuccess',
  FETCH_INBOX_ERROR = 'npwd:fetchEmailInboxError',
  SEND_EMAIL = 'npwd:sendEmail',
  SEND_EMAIL_SUCCESS = 'npwd:sendEmailSuccess',
  SEND_EMAIL_ERROR = 'npwd:sendEmailError',
}
