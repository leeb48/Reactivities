import { ProfileActivity } from 'app/models/profile';
import { format } from 'date-fns';
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
        style={{ height: '100px' }}
      />
      <Card.Content>
        <Card.Header>{profileActivity.title}</Card.Header>
        <Card.Meta textAlign='center'>
          {/* {new Date(profileActivity.date!).toLocaleString('default', {
            dateStyle: 'long',
          })} */}
          <div>{format(new Date(profileActivity.date), 'do LLL')}</div>
          <div>{format(new Date(profileActivity.date), 'h:mm a')}</div>
          {console.log(profileActivity.date)}
        </Card.Meta>
        <Card.Meta textAlign='center'>
          {profileActivity.category.toUpperCase()}
        </Card.Meta>
      </Card.Content>
    </Card>
  );
};

export default ProfileEventsCard;
