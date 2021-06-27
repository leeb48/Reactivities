import { ProfileActivity } from 'app/models/profileActivity';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image } from 'semantic-ui-react';

interface Props {
  profileActivity: ProfileActivity;
}

const ProfileEventsCard: React.FC<Props> = ({ profileActivity }) => {
  return (
    <Card as={Link} to={`/activities/${profileActivity.id}`}>
      <Image
        src={`/assets/categoryImages/${profileActivity.category.toLocaleLowerCase()}.jpg`}
      />
      <Card.Content>
        <Card.Header>{profileActivity.title}</Card.Header>
        <Card.Meta textAlign='center'>
          {new Date(profileActivity.date!).toLocaleString('default', {
            dateStyle: 'long',
          })}
        </Card.Meta>
        <Card.Meta textAlign='center'>
          {profileActivity.category.toUpperCase()}
        </Card.Meta>
      </Card.Content>
    </Card>
  );
};

export default ProfileEventsCard;
