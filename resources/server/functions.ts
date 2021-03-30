import { pool } from './db';
import config from '../utils/config';
import { mainLogger } from './sv_logger';
import { getDefaultProfileNames, Player, Players, PlayersByIdentifier } from './players/sv_players';

export function getPlayer(source: number): Player {
  const player = Players.get(source);
  if (!player) mainLogger.error(`Could not find player from source: ${source}`);
  return player;
}

export const getSource = () => (global as any).source;

// we might need to run a db query on this.
// to make it more standalone
/**
 * Return the identifier for an online player
 * @param source The source/netId for the player in question
 **/
export function getIdentifier(source: number): string {
  return getPlayer(source).identifier;
}

/**
 * Return the attached identifier for a given phone number
 * @param phoneNumber The phone number to return identifier for
 * @param fetch Whether or not to query the database if a given player is offline
 **/
export async function getIdentifierByPhoneNumber(
  phoneNumber: string,
  fetch?: boolean,
): Promise<string | null> {
  for (const [source, player] of Players) {
    if (player.getPhoneNumber() === phoneNumber) return player.identifier;
  }
  // Whether we fetch from database if not found in online players
  if (fetch) {
    const query = `SELECT identifier FROM users WHERE phone_number = ?`;
    const [results] = await pool.query(query, [phoneNumber]);
    // Get identifier from results
    return (results as { identifier: string }[])[0].identifier;
  }
  return null;
}

/**
 * Return the attached email for a given identifier
 * @param identifier The identifier to return email for
 * @param fetch Whether or not to query the database if a given player is offline
 **/
export async function getEmailByIdentifier(
  identifier: string,
  fetch?: boolean,
): Promise<string | null> {
  const online = PlayersByIdentifier.get(identifier);
  if (online) return online.getEmail();
  // Whether we fetch from database if not found in online players
  if (fetch) {
    const query = `SELECT phone_email FROM users WHERE identifier = ?`;
    const [results] = await pool.query(query, [identifier]);
    // Get identifier from results
    return (results as { phone_email: string }[])[0].phone_email;
  }
  return null;
}

/**
 * Return the attached identifier for a given email
 * @param email The email to return identifier for
 * @param fetch Whether or not to query the database if a given player is offline
 **/
export async function getIdentifierByEmail(email: string, fetch?: boolean): Promise<string | null> {
  for (const [source, player] of Players) {
    if (player.getEmail() === email) return player.identifier;
  }
  // Whether we fetch from database if not found in online players
  if (fetch) {
    const query = `SELECT identifier FROM users WHERE phone_email = ?`;
    const [results] = await pool.query(query, [email]);
    // Get identifier from results
    return (results as { identifier: string }[])[0].identifier;
  }
  return null;
}

/**
 * Returns the player phoneNumber for a passed identifier
 * @param identifier The players phone number
 */
export function getPlayerFromIdentifier(identifier: string): Player | null {
  const player = PlayersByIdentifier.get(identifier);
  if (!player) return null;
  return player;
}

function getRandomPhoneNumber() {
  let randomNumber: string = null;

  if (!config.general.useDashNumber) {
    randomNumber = Math.floor(Math.random() * 10000000).toString(); // 10000000 creates a number with 7 characters.
  } else {
    randomNumber = Math.floor(Math.random() * 10000000)
      .toString()
      .replace(/(\d{3})(\d{4})/, '$1-$2');
    // The numbers inside {} in replace() can be changed to how many digits you want on each side of the dash.
    // Example: 123-4567
  }
  mainLogger.debug(`Getting random number: ${randomNumber}`);

  return randomNumber;
}

export async function generatePhoneNumber(identifier: string): Promise<string> {
  const getQuery = `SELECT phone_number FROM users WHERE identifier = ?`;
  const [results] = await pool.query(getQuery, [identifier]);
  const result = <any[]>results;
  const phoneNumber = result[0]?.phone_number;

  if (!phoneNumber) {
    let existingId;
    let newNumber;
    do {
      newNumber = getRandomPhoneNumber();
      try {
        existingId = await getIdentifierByPhoneNumber(newNumber);
      } catch (e) {
        existingId = false;
      }
    } while (existingId);
    const query = 'UPDATE users SET phone_number = ? WHERE identifier = ?';
    await pool.query(query, [newNumber, identifier]);
    mainLogger.debug(`Inserting number into Database: ${newNumber}`);
    return newNumber;
  }
  return phoneNumber;
}

export async function generateEmail(
  identifier: string,
  cb?: (email: string) => void,
): Promise<string> {
  const getQuery = `SELECT phone_email FROM users WHERE identifier = ?`;
  const [results] = await pool.query(getQuery, [identifier]);
  const result = <any[]>results;
  const email = result[0]?.phone_email;

  if (!email) {
    const userProfileNames = await getDefaultProfileNames(identifier);

    if (!userProfileNames) {
      throw new Error('Must provide a fullName or phoneNumber option to create an email');
    }

    const emailProvider = config.email.provider || 'project-error.dev';

    const newEmail = `${userProfileNames[0]}@${emailProvider}`.trim().toLowerCase();
    const query = 'UPDATE users SET phone_email = ? WHERE identifier = ?';
    await pool.query(query, [newEmail, identifier]);
    cb?.(newEmail);
    mainLogger.debug(`Inserting email into Database: ${newEmail}`);
    return newEmail;
  }
  return email;
}
