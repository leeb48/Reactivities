import { Profile } from 'app/models/profile';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';

interface Props {
  profile: Profile;
}

const ProfileCard: React.FC<Props> = ({ profile }) => {
  return (
    <Card as={Link} to={`/profiles/${profile.username}`}>
      <Image src={profile.image || '/assets/user.png'} />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>Bio goes here</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="user" />
        20 Followers
      </Card.Content>
    </Card>
  );
};

export default observer(ProfileCard);
