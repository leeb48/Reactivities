import { useStore } from 'app/stores/store';
import ActivityDashboard from 'features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import LoadingComponent from './LoadingComponent';
import Navbar from './Navbar';

function App() {
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading App" />;

  return (
    <>
      <Navbar />

      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard />
      </Container>
    </>
  );
}

export default observer(App);
