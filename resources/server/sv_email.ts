import events from '../utils/events';
import { mainLogger } from './sv_logger';
import { getSource } from './functions';
import { pool } from './db';

const emailLogger = mainLogger.child({ module: 'contact' });

async function fetchInbox(email: string): Promise<any> {
  const query = `
    SELECT * FROM npwd_emails WHERE id = ?
  `;
  const result = await pool.query(query, [email]);
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
