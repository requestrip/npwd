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
  subject: string;
  body: string;
}

export interface IEmail {
  id: number;
  messages: IEmailMessage[];
  phoneActions?: Array<IEmailPhoneAction>;
  externalActions?: Array<IEmailExternalAction>;
}
