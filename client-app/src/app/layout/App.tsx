import agent from 'app/api/agent';
import { Activity } from 'app/models/activity';
import { useStore } from 'app/stores/store';
import ActivityDashboard from 'features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import LoadingComponent from './LoadingComponent';
import Navbar from './Navbar';

function App() {
  const { activityStore } = useStore();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  async function handleDeleteActivity(id: string) {
    setSubmitting(true);

    await agent.Activities.delete(id);

    setActivities([...activities.filter((x) => x.id !== id)]);

    setSubmitting(false);
  }

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading App" />;

  return (
    <>
      <Navbar />

      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activityStore.activities}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default observer(App);
