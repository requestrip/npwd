import { Box, makeStyles } from '@material-ui/core';
import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppContent } from '../../../ui/components/AppContent';
import { EmailThemeProvider } from '../providers/EmailThemeProvider';
import EmailNavBar from './EmailNavBar';
import { Route, Switch } from 'react-router-dom';
import { InboxPage } from './InboxPage';
import { EmailAppHeader } from './EmailAppHeader';

export const EmailApp = () => {
  return (
    <EmailThemeProvider>
      <AppWrapper>
        <EmailAppHeader />
        <AppContent>
          <Switch>
            <Route path="/email" exact>
              <InboxPage />
            </Route>
          </Switch>
        </AppContent>
        <EmailNavBar />
      </AppWrapper>
    </EmailThemeProvider>
  );
};
