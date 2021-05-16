import ActivityDashboard from 'features/activities/dashboard/ActivityDashboard';
import ActivityDetails from 'features/activities/details/ActivityDetails';
import ActivityForm from 'features/activities/form/ActivityForm';
import HomePage from 'features/home/HomePage';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Route, useLocation } from 'react-router';
import { Container } from 'semantic-ui-react';
import Navbar from './Navbar';

function App() {
  const location = useLocation();

  return (
    <>
      <Route path="/" exact component={HomePage} />
      <Route
        path={`/(.+)`}
        render={() => (
          <>
            <Navbar />
            <Container style={{ marginTop: '7em' }}>
              <Route path="/" exact component={HomePage} />
              <Route path="/activities" exact component={ActivityDashboard} />
              <Route path="/activities/:id" exact component={ActivityDetails} />
              <Route
                key={location.key}
                path={['/createActivity', '/manage/:id']}
                exact
                component={ActivityForm}
              />
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
