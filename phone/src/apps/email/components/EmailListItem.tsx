import React from 'react';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import MarkRead from '@material-ui/icons/Markunread';
import MarkUnread from '@material-ui/icons/MarkunreadMailbox';
import { useEmail } from '../hooks/useEmail';
import { IEmail } from '../../../common/typings/email';
import { useHistory } from 'react-router';

export const EmailListItem = ({ email }: { email: IEmail }) => {
  const { t } = useTranslation();
  const { isMine } = useEmail();
  const history = useHistory();

  const sendDate = dayjs.unix(email.sendDate).format(t('DATE_FORMAT'));
  const read = email.isRead === true;
  const mine = isMine(email);
  const highlight = !mine && !read;

  return (
    <ListItem
      button
      divider
      key={email.id}
      onClick={() => history.push(`/email/details/${email.id}`)}
    >
      <ListItemAvatar>
        <Avatar>{email.sender.charAt(0).toUpperCase()}</Avatar>
      </ListItemAvatar>
      <ListItemText secondary={highlight ? <strong>{sendDate}</strong> : <span>{sendDate}</span>}>
        {highlight ? <strong>{email.subject}</strong> : <span>{email.subject}</span>}
      </ListItemText>
      <ListItemSecondaryAction>
        {!mine && (
          <IconButton>
            {read ? <MarkUnread color="primary" /> : <MarkRead color="primary" />}
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};
