import ModalContainer from 'app/common/modals/ModalContainer';
import { useStore } from 'app/stores/store';
import ActivityDashboard from 'features/activities/dashboard/ActivityDashboard';
import ActivityDetails from 'features/activities/details/ActivityDetails';
import ActivityForm from 'features/activities/form/ActivityForm';
import NotFound from 'features/errors/NotFound';
import ServerError from 'features/errors/ServerError';
import TestErrors from 'features/errors/TestError';
import HomePage from 'features/home/HomePage';
import ProfilePage from 'features/profiles/ProfilePage';
import LoginForm from 'features/users/LoginForm';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { Container } from 'semantic-ui-react';
import LoadingComponent from './LoadingComponent';
import Navbar from './Navbar';

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent content="Loading app..." />;

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer />
      <Route path="/" exact component={HomePage} />
      <Route
        path={`/(.+)`}
        render={() => (
          <>
            <Navbar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route path="/" exact component={HomePage} />
                <Route path="/activities" exact component={ActivityDashboard} />
                <Route
                  path="/activities/:id"
                  exact
                  component={ActivityDetails}
                />
                <Route
                  key={location.key}
                  path={['/createActivity', '/manage/:id']}
                  exact
                  component={ActivityForm}
                />
                <Route
                  path="/profiles/:username"
                  exact
                  component={ProfilePage}
                />
                <Route path="/errors" exact component={TestErrors} />
                <Route path="/server-error" exact component={ServerError} />
                <Route path="/login" exact component={LoginForm} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
