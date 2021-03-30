import { IEmailExternalAction, IEmailPhoneAction } from '../../../typings/email';
import { pool } from './../db';

export interface UnformattedEmailMessage {
  message_id: number;
  parent_id?: number | null;
  email_id: number;
  read_at: number | null;
  subject: string;
  sender: string;
  sender_identifier: string;
  receiver: string;
  receiver_identifier: string;
  send_date: number;
  body: string;
  actions: boolean;
}

export interface UnformattedEmailExternalAction {
  id: number;
  message_id: number;
  label: string;
  close_phone: boolean;
  delete_email: boolean;
  event_name: string;
  event_arg: string;
}

export interface UnformattedEmailPhoneAction {
  id: number;
  message_id: number;
  label: string;
  close_phone: boolean;
  delete_email: boolean;
  href: string;
}

export async function fetchMessageActions(
  id: number,
): Promise<{
  phoneActions: UnformattedEmailPhoneAction[];
  externalActions: UnformattedEmailExternalAction[];
}> {
  const queryPhoneActions = `
    SELECT
      npwd_emails_phone_actions.label as action_phone_label,
      npwd_emails_phone_actions.close_phone as action_phone_close_phone,
      npwd_emails_phone_actions.delete_email as action_phone_delete_email,
      npwd_emails_phone_actions.href as action_phone_href
    FROM npwd_emails_phone_actions
    WHERE message_id = ?;
  `;
  const queryExternalActions = `
    SELECT 
      npwd_emails_external_actions.label as action_ext_label,
      npwd_emails_external_actions.close_phone as action_ext_close_phone,
      npwd_emails_external_actions.delete_email as action_ext_delete_email,
      npwd_emails_external_actions.event_name as action_ext_event_name,
      npwd_emails_external_actions.event_arg as action_ext_event_arg,
    FROM npwd_emails_external_actions
    WHERE message_id = ?;
  `;

  const [phoneActions] = await pool.query(queryPhoneActions, [id]);
  const [externalActions] = await pool.query(queryExternalActions, [id]);

  return {
    phoneActions: phoneActions as UnformattedEmailPhoneAction[],
    externalActions: externalActions as UnformattedEmailExternalAction[],
  };
}

export async function fetchInbox(identifier: string): Promise<UnformattedEmailMessage[]> {
  const query = `
    SELECT
      npwd_emails_messages.parent_id,
      npwd_emails_messages.email_id,
      npwd_emails_messages.sender,
      npwd_emails_messages.sender_identifier,
      npwd_emails_messages.send_date,
      npwd_emails_messages.body,
      npwd_emails_messages.actions,
      npwd_emails_receivers.message_id,
      npwd_emails_receivers.receiver,
      npwd_emails_receivers.receiver_identifier,
      npwd_emails_receivers.read_at,
      subject
    FROM (
      SELECT id, subject FROM npwd_emails
    ) as e
    LEFT OUTER JOIN npwd_emails_messages ON npwd_emails_messages.email_id = e.id
    LEFT OUTER JOIN npwd_emails_receivers ON npwd_emails_receivers.message_id = npwd_emails_messages.id
    WHERE npwd_emails_receivers.receiver_identifier = ? OR npwd_emails_messages.sender_identifier = ?
    ORDER BY npwd_emails_messages.send_date DESC
  `;

  const result = await pool.query(query, [identifier, identifier]);

  return result[0] as UnformattedEmailMessage[];
}

export async function sendEmail(
  sender_identifier: string,
  sender: string,
  receivers: { email: string; identifier: string }[],
  body: string,
  email_id_or_subject: number | string,
  parent_id?: number,
  phone_actions?: IEmailPhoneAction[],
  external_actions?: IEmailExternalAction[],
) {
  let email_id = typeof email_id_or_subject === 'number' ? email_id_or_subject : undefined;

  const actions =
    (external_actions ? external_actions.length : 0) + (phone_actions ? phone_actions.length : 0);

  if (typeof email_id_or_subject === 'string') {
    const emailQuery = `INSERT INTO npwd_emails (subject) VALUES (?)`;
    const [emailResult] = await pool.query(emailQuery, [email_id_or_subject]);
    email_id = (emailResult as any).insertId;
  }

  const messageQuery = `INSERT INTO npwd_emails_messages (email_id, parent_id, send_date, body, sender, sender_identifier, actions) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const [messageResult] = await pool.query(messageQuery, [
    email_id,
    parent_id || null,
    Math.floor(Date.now() / 1000),
    body,
    sender,
    sender_identifier,
    actions,
  ]);

  const message_id = (messageResult as any).insertId;

  const receiverQuery = `INSERT INTO npwd_emails_receivers (message_id, receiver, receiver_identifier, read_at) VALUES (?, ?, ?, ?)`;
  const receiverPromises = receivers.map((r) =>
    pool.query(receiverQuery, [message_id, r.email, r.identifier, null]),
  );

  const phoneActionQuery = `INSERT INTO npwd_emails_phone_actions (message_id, label, close_phone, delete_email, href) VALUES (?, ?, ?, ?, ?)`;
  const externalActionQuery = `INSERT INTO npwd_emails_external_actions (message_id, label, close_phone, delete_email, event_name, event_arg) VALUES (?, ?, ?, ?, ?, ?)`;

  if (actions > 0) {
    const actionPromises = [
      ...phone_actions.map((action) => {
        const label = action.label;
        const href = action.href;

        if (!label || !href) {
          return;
        }

        const closePhone = action.closePhone !== undefined ? action.closePhone : true;
        const deleteEmail = action.deleteEmail !== undefined ? action.deleteEmail : true;
        return pool.query(phoneActionQuery, [message_id, label, closePhone, deleteEmail, href]);
      }),
      ...external_actions.map((action) => {
        const label = action.label;
        const callbackEvent = action.callbackEvent;

        if (!label || !callbackEvent) {
          return;
        }

        const callbackArg = action.callbackArg || null;
        const closePhone = action.closePhone !== undefined ? action.closePhone : true;
        const deleteEmail = action.deleteEmail !== undefined ? action.deleteEmail : true;

        return pool.query(externalActionQuery, [
          message_id,
          label,
          closePhone,
          deleteEmail,
          callbackEvent,
          callbackArg,
        ]);
      }),
    ];
    await Promise.all(actionPromises);
  }

  await Promise.all(receiverPromises);

  return messageResult;
}
