import { ResourceConfig } from '../../typings/config';
import { RewriteFrames } from '@sentry/integrations';

// Setup and export config loaded at runtime
export const config: ResourceConfig = (() => {
  const config = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'config.json'));
  const convars = ['general', 'database'];

  convars.forEach((cfg) => {
    const options = (config as any)[cfg];
    let convar = GetConvar(`npwd_${cfg}`, '');

    if (convar !== '') {
      convar = JSON.parse(convar);

      Object.entries(convar).forEach(([key, value]) => {
        // Type safety before overriding values
        if (typeof value === typeof options[key]) options[key] = value;
      });
    }
  });

  return config;
})();

// Setup controllers
import './db/pool';
import './players/player.controller';
import './calls/calls.controller';
import './notes/notes.controller';
import './contacts/contacts.controller';
import './photo/photo.controller';
import './messages/messages.controller';
import './marketplace/marketplace.controller';
import './twitter/twitter.controller';
import './match/match.controller';

// setup exports
import './bridge/sv_exports';

import { mainLogger } from './sv_logger';
import * as Sentry from '@sentry/node';

// Setup sentry tracing
if (config.debug.sentryEnabled && process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://5c5da180a57e4db1acb617ef2c6cb59f@sentry.projecterror.dev/3',
    integrations: [new RewriteFrames()],
    release: process.env.SENTRY_RELEASE || '0.0.0',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

on('onServerResourceStart', (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    mainLogger.info('Sucessfully started');
  }
});
