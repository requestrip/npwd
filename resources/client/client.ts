import ClientUtils from './cl_utils';
import { ResourceConfig } from '../../typings/config';

// Setup and export the config for the resource
export const config: ResourceConfig = (() => {
  const config = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'config.json'));
  const convars = ['general', 'phoneAsItem'];

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

import './cl_main';
import './cl_twitter';
import './cl_contacts';
import './cl_marketplace';
import './cl_notes';
import './cl_photo';
import './cl_messages';
import './calls/cl_calls.controller';
import './cl_match';
import './functions';
import './cl_exports';

export const ClUtils = new ClientUtils();
