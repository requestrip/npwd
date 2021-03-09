import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppContent } from '../../../ui/components/AppContent';
import { EmailThemeProvider } from '../providers/EmailThemeProvider';
import EmailNavBar from './EmailNavBar';
import { Route, Switch } from 'react-router-dom';
import { InboxPage } from './InboxPage';
import { EmailAppHeader } from './EmailAppHeader';
import { NewEmailPage } from './NewEmailPage';
import { SentPage } from './SentPage';
import { EmailDetails } from './EmailDetails';

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
            <Route path="/email/sent" exact>
              <SentPage />
            </Route>
            <Route path="/email/new" exact>
              <NewEmailPage />
            </Route>
            <Route path="/email/details/:id">
              <EmailDetails />
            </Route>
          </Switch>
        </AppContent>
        <EmailNavBar />
      </AppWrapper>
    </EmailThemeProvider>
  );
};
