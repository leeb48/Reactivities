import { Profile } from 'app/models/profile';
import { useStore } from 'app/stores/store';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import ProfileAbout from './ProfileAbout';
import ProfileFollowing from './ProfileFollowing';
import ProfilePhotos from './ProfilePhotos';

interface Props {
  profile: Profile;
}

const ProfileContent: React.FC<Props> = ({ profile }) => {
  const { profileStore } = useStore();

  const panes = [
    { menuItem: 'About', render: () => <ProfileAbout /> },
    { menuItem: 'Photo', render: () => <ProfilePhotos profile={profile} /> },
    { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
    {
      menuItem: 'Followers',
      render: () => <ProfileFollowing />,
    },
    {
      menuItem: 'Following',
      render: () => <ProfileFollowing />,
    },
  ];

  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition='right'
      panes={panes}
      onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex)}
    />
  );
};

export default observer(ProfileContent);
