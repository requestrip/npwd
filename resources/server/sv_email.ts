import events from '../utils/events';
import { mainLogger } from './sv_logger';
import { getSource } from './functions';
import { pool } from './db';

const emailLogger = mainLogger.child({ module: 'contact' });

async function fetchInbox(identifier: string): Promise<any> {
  const query = `
    SELECT
      npwd_emails.subject,
      npwd_emails_messages.parent_id,
      npwd_emails_messages.email_id,
      npwd_emails_messages.sender,
      npwd_emails_messages.sender_identifier,
      npwd_emails_messages.send_date,
      npwd_emails_messages.body,
      npwd_emails_receivers.id,
      npwd_emails_receivers.receiver,
      npwd_emails_receivers.receiver_identifier
    FROM (
      SELECT id, read_at, message_id FROM npwd_emails_receivers WHERE npwd_emails_receivers.receiver_identifier = ?
    ) as er
    LEFT OUTER JOIN npwd_emails_messages ON npwd_emails_messages.id = er.message_id
    LEFT OUTER JOIN npwd_emails_receivers ON npwd_emails_receivers.message_id = npwd_emails_messages.id
    LEFT OUTER JOIN npwd_emails ON npwd_emails.id = npwd_emails_messages.email_id
    WHERE npwd_emails_receivers.receiver_identifier = ?
    ORDER BY npwd_emails_messages.send_date DESC
  `;
  const result = await pool.query(query, [identifier]);
  return result[0];
}

onNet(events.EMAIL_FETCH_INBOX, async () => {
  const _source = getSource();
  try {
    const email = 'kidz@projecterror.dev';
    const inbox = await fetchInbox(email);
    emitNet(events.EMAIL_FETCH_INBOX_SUCCESS, inbox);
  } catch (e) {
    emailLogger.error(`Failed to fetch email inbox, ${e.message}`, {
      source: _source,
    });
    emitNet(events.EMAIL_FETCH_INBOX_ERROR, e);
  }
});
