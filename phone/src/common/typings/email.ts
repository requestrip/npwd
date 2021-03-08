export interface IEmailPhoneAction {
  path: string;
}

export interface IEmailExternalAction {
  eventName: string;
  args: Array<string | number>;
  closePhone?: boolean;
}

export interface IEmail {
  id: number;
  isRead: boolean;
  receivers: string[];
  sender: string;
  sendDate: number;
  subject: string;
  body: string;
  phoneActions?: Array<IEmailPhoneAction>;
  externalActions?: Array<IEmailExternalAction>;
}
