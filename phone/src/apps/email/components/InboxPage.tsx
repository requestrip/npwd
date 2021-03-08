import React, { useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField,
} from '@material-ui/core';
import MarkRead from '@material-ui/icons/Markunread';
import MarkUnread from '@material-ui/icons/MarkunreadMailbox';
import { useQueryParams } from '../../../common/hooks/useQueryParams';
import { useEmail } from '../hooks/useEmail';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  search: {
    zIndex: 5,
    position: 'absolute',
    backgroundColor: theme.palette.primary.light,
    top: 0,
  },
}));

export const InboxPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { emails } = useEmail();

  const [search, setSearch] = useState<string>('');

  const { autoSearch } = useQueryParams<{ autoSearch }>();

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const getSendDate = (email) => dayjs.unix(email.sendDate).format(t('DATE_FORMAT'));

  return (
    <Box height="100%" pt="80px" position="relative">
      <Box width="100%" p={2} className={classes.search}>
        <TextField
          placeholder="Search e-mails"
          fullWidth
          variant="outlined"
          autoFocus={!!autoSearch}
          onChange={handleSearch}
          value={search}
        />
      </Box>
      <Box overflow="auto" maxHeight="100%">
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
      </Box>
    </Box>
  );
};
