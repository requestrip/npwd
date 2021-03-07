import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { emailState } from './state';

export const useEmailService = () => {
  const setEmails = useSetRecoilState(emailState.emails);

  useNuiEvent('EMAIL', 'phone:fetchAllEmailsSuccess', setEmails);
};
