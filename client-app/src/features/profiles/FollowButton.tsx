import { Profile } from 'app/models/profile';
import { useStore } from 'app/stores/store';
import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent } from 'react';
import { Reveal, Button } from 'semantic-ui-react';

interface Props {
  profile: Profile;
}

const FollowButton: React.FC<Props> = ({ profile }) => {
  const { profileStore, userStore } = useStore();
  const { updateFollowing, loading } = profileStore;

  if (userStore.user?.username === profile.username) return null;

  const handleFollow = (e: SyntheticEvent, username: string) => {
    e.stopPropagation();
    e.preventDefault();

    profile.following
      ? updateFollowing(username, false)
      : updateFollowing(username, true);
  };

  return (
    <Reveal animated='move'>
      <Reveal.Content visible style={{ width: '100%' }}>
        <Button
          fluid
          color='teal'
          content={profile.following ? 'Following' : 'Not Following'}
          onClick={(e) => handleFollow(e, profile.username)}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: '100%' }}>
        <Button
          fluid
          basic
          color={profile.following ? 'red' : 'green'}
          content={profile.following ? 'Unfollow' : 'Follow'}
          loading={loading}
          onClick={(e) => handleFollow(e, profile.username)}
        />
      </Reveal.Content>
    </Reveal>
  );
};

export default observer(FollowButton);
