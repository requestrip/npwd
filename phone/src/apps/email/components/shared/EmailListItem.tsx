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
import { IEmail } from '../../../../common/typings/email';
import { useHistory } from 'react-router';
import { useEmail } from '../../hooks/useEmail';

export const EmailListItem = ({ email }: { email: IEmail }) => {
  const { t } = useTranslation();
  const { head } = useEmail();
  const history = useHistory();

  const latestMessage = head(email.messages);

  const sendDate = dayjs.unix(latestMessage.sendDate).format(t('DATE_FORMAT'));
  const read = latestMessage.isRead === true;
  const mine = latestMessage.isMine === true;
  const highlight = !mine && !read;
  return (
    <ListItem
      button
      divider
      key={latestMessage.id}
      onClick={() => history.push(`/email/details/${email.id}`)}
    >
      <ListItemAvatar>
        <Avatar>{latestMessage.sender.charAt(0).toUpperCase()}</Avatar>
      </ListItemAvatar>
      <ListItemText secondary={highlight ? <strong>{sendDate}</strong> : <span>{sendDate}</span>}>
        {highlight ? (
          <strong>{latestMessage.subject}</strong>
        ) : (
          <span>{latestMessage.subject}</span>
        )}
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
