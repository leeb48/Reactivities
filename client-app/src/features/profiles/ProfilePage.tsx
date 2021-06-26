import LoadingComponent from 'app/layout/LoadingComponent';
import { useStore } from 'app/stores/store';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();

  const {
    profileStore: { loadingProfile, loadProfile, profile, setActiveTab },
  } = useStore();

  useEffect(() => {
    loadProfile(username);

    return () => setActiveTab(0);
  }, [loadProfile, username, setActiveTab]);

  if (loadingProfile) return <LoadingComponent content='Loading Profile...' />;

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && (
          <>
            <ProfileHeader profile={profile} />
            <ProfileContent profile={profile} />
          </>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
