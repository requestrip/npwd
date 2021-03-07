import { useRecoilValue } from 'recoil';
import { emailState } from './state';

export const useEmail = () => {
  const emails = useRecoilValue(emailState.emails);

  return { emails };
};
