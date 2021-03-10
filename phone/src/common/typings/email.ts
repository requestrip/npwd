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
