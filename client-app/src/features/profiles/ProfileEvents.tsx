import { Profile } from 'app/models/profile';
import { useStore } from 'app/stores/store';
import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent } from 'react';
import { useEffect } from 'react';
import { Card, Grid, Header, Tab, TabProps } from 'semantic-ui-react';
import ProfileEventsCard from './ProfileEventsCard';
import ProfileEventsPlaceHolder from './ProfileEventsPlaceHolder';

const panes = [
  {
    menuItem: 'All Events',
    pane: { key: 'all' },
  },
  {
    menuItem: 'Future Events',
    pane: { key: 'future' },
  },
  {
    menuItem: 'Past Events',
    pane: { key: 'past' },
  },
  {
    menuItem: 'Hosting',
    pane: { key: 'hosting' },
  },
];

const ProfileEvents = () => {
  const {
    profileStore: {
      profileActivity,
      setPredicate,
      loadProfileActivities,
      loading,
    },
  } = useStore();

  useEffect(() => {
    loadProfileActivities();
  }, []);

  const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
    setPredicate(panes[data.activeIndex as number].pane.key);
    loadProfileActivities();
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column widht={16}>
          <Header floated='left' icon='calendar' content='Activities' />
        </Grid.Column>
      </Grid>
      <br />
      <Grid.Column width={16}>
        <Tab
          panes={panes}
          onTabChange={(e, data) => handleTabChange(e, data)}
        />
        <Tab.Pane>
          {loading ? (
            <ProfileEventsPlaceHolder />
          ) : (
            <Card.Group itemsPerRow={4}>
              {profileActivity &&
                profileActivity.map((activity) => (
                  <ProfileEventsCard
                    key={activity.id}
                    profileActivity={activity}
                  />
                ))}
            </Card.Group>
          )}
        </Tab.Pane>
      </Grid.Column>
    </Tab.Pane>
  );
};

export default observer(ProfileEvents);
