import {
  IEmail,
  IEmailExternalAction,
  IEmailMessage,
  IEmailPhoneAction,
} from '../../../typings/email';
import {
  UnformattedEmailExternalAction,
  UnformattedEmailMessage,
  UnformattedEmailPhoneAction,
} from './sv_email';

export function formatMessage(message: UnformattedEmailMessage, myEmail: string): IEmailMessage {
  return {
    body: message.body,
    emailId: message.email_id,
    id: message.message_id,
    receivers: [message.receiver],
    sendDate: message.send_date,
    sender: message.sender,
    hasActions: message.actions,
    isMine: message.sender === myEmail,
    isRead: message.receiver === myEmail ? !!message.read_at : null,
  };
}

export function mapUnformattedEmailMessages(
  messages: UnformattedEmailMessage[],
  myEmail: string,
): IEmail[] {
  const map = messages.reduce((emails, message) => {
    if (emails.has(message.email_id)) {
      const email = emails.get(message.email_id);
      if (email.messagesMap.has(message.message_id)) {
        const currentMessage = email.messagesMap.get(message.message_id);
        if (message.receiver === myEmail && !currentMessage.isRead) {
          currentMessage.isRead === !!message.read_at;
        }
        email.messagesMap.set(message.message_id, {
          ...currentMessage,
          receivers: [...currentMessage.receivers, message.receiver_identifier],
        });
      } else {
        email.messagesMap.set(message.message_id, formatMessage(message, myEmail));
      }
      emails.set(message.email_id, {
        ...email,
        messages: Array.from(email.messagesMap.values()),
      });
      return emails;
    }
    const messagesMap = new Map<number, IEmailMessage>();
    messagesMap.set(message.message_id, formatMessage(message, myEmail));
    emails.set(message.email_id, {
      id: message.email_id,
      messagesMap,
      messages: Array.from(messagesMap.values()),
      subject: message.subject,
    });
    return emails;
  }, new Map<number, IEmail & { messagesMap: Map<number, IEmailMessage> }>());

  return Array.from(map.values()).map((m) => ({ ...m, messagesMap: undefined }));
}

export function mapUnformattedEmailPhoneActions(
  actions: UnformattedEmailPhoneAction[],
): IEmailPhoneAction[] {
  return actions.map((action) => ({
    closePhone: action.close_phone,
    deleteEmail: action.delete_email,
    href: action.href,
    label: action.label,
  }));
}

export function mapUnformattedEmailExternalActions(
  actions: UnformattedEmailExternalAction[],
): IEmailExternalAction[] {
  return actions.map((action) => ({
    closePhone: action.close_phone,
    deleteEmail: action.delete_email,
    callbackEvent: action.event_name,
    callbackArg: action.event_arg,
    label: action.label,
  }));
}
