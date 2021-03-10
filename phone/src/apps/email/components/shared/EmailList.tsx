import React from 'react';
import { IEmail } from '../../../../common/typings/email';
import { EmailListItem } from './EmailListItem';
import { List } from '@material-ui/core';

interface IProps {
  emails: IEmail[];
}

export const EmailList = ({ emails }: IProps) => {
  return (
    <List>{emails && emails.map((email) => <EmailListItem key={email.id} email={email} />)}</List>
  );
};
