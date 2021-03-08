import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import React from 'react';
import { IEmail } from '../../../common/typings/email';
import MarkRead from '@material-ui/icons/Markunread';
import MarkUnread from '@material-ui/icons/MarkunreadMailbox';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface IProps {
  emails: IEmail[];
}

export const EmailList = ({ emails }: IProps) => {
  const { t } = useTranslation();

  const getSendDate = (email) => dayjs.unix(email.sendDate).format(t('DATE_FORMAT'));

  return (
    <List>
      {emails &&
        emails.map((email) => (
          <ListItem button divider key={email.id}>
            <ListItemAvatar>
              <Avatar>{email.sender.charAt(0).toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText
              secondary={
                email.isRead ? (
                  <span>{getSendDate(email)}</span>
                ) : (
                  <strong>{getSendDate(email)}</strong>
                )
              }
            >
              {email.isRead ? <span>{email.subject}</span> : <strong>{email.subject}</strong>}
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton>
                {email.isRead ? <MarkUnread color="primary" /> : <MarkRead color="primary" />}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
    </List>
  );
};
