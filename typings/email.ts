export interface IEmailPhoneAction {
  href: string;
  label: string;
  deleteEmail?: boolean;
  closePhone?: boolean;
}

export interface IEmailExternalAction {
  callbackEvent: string;
  callbackArg: string | number | boolean | void;
  label: string;
  deleteEmail?: boolean;
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
  hasActions: boolean;
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
  phoneActions?: IEmailPhoneAction[];
  externalActions?: IEmailExternalAction[];
}

export interface SendEmailToIdentifierInput {
  identifier: string;
  provider: string;
  subject: string;
  body: string;
  phoneActions: IEmailPhoneAction[];
  externalActions: IEmailExternalAction[];
}

export enum GlobalEmailEvents {
  SEND_EMAIL_TO_IDENTIFIER = 'npwd:sendEmailToIdentifier',
}

export enum EmailEvents {
  FETCH_INBOX = 'npwd:fetchEmailInbox',
  FETCH_INBOX_SUCCESS = 'npwd:fetchEmailInboxSuccess',
  FETCH_INBOX_ERROR = 'npwd:fetchEmailInboxError',
  SEND_EMAIL = 'npwd:sendEmail',
  SEND_EMAIL_SUCCESS = 'npwd:sendEmailSuccess',
  SEND_EMAIL_ERROR = 'npwd:sendEmailError',
  FETCH_MESSAGE_ACTIONS = 'npwd:fetchEmailMessageActions',
  FETCH_MESSAGE_ACTIONS_SUCCESS = 'npwd:fetchEmailMessageActionsSuccess',
  FETCH_MESSAGE_ACTIONS_ERROR = 'npwd:fetchEmailMessageActionsError',
}
