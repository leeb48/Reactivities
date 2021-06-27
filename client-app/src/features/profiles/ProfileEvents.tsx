import { Profile } from 'app/models/profile';
import { useStore } from 'app/stores/store';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useEffect } from 'react';
import { Card, Tab } from 'semantic-ui-react';
import ProfileEventsCard from './ProfileEventsCard';

interface Props {
  profile: Profile;
}

const ProfileEvents: React.FC<Props> = ({ profile }) => {
  const {
    profileStore: { profileActivity, setPredicate, loadProfileActivities },
  } = useStore();

  const panesMap: { [key: number]: string } = {
    0: 'future',
    1: 'past',
    2: 'hosting',
  };

  useEffect(() => {
    loadProfileActivities(profile.username);
  }, []);

  const renderProfileActivities = () => (
    <Tab.Pane attached={false}>
      <Card.Group itemsPerRow={4}>
        {profileActivity &&
          profileActivity.map((activity) => (
            <ProfileEventsCard key={activity.id} profileActivity={activity} />
          ))}
      </Card.Group>
    </Tab.Pane>
  );

  const panes = [
    {
      menuItem: 'Future Events',
      render: () => renderProfileActivities(),
    },
    {
      menuItem: 'Past Events',
      render: () => renderProfileActivities(),
    },
    {
      menuItem: 'Hosting',
      render: () => renderProfileActivities(),
    },
  ];

  return (
    <Tab.Pane>
      <Tab
        panes={panes}
        onTabChange={(e, data) => {
          setPredicate(panesMap[data.activeIndex as number]);
          loadProfileActivities(profile.username);
        }}
      />
    </Tab.Pane>
  );
};

export default observer(ProfileEvents);
