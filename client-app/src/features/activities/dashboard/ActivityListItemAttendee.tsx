import { Profile } from 'app/models/profile';
import ProfileCard from 'features/profiles/ProfileCard';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Image, List, Popup } from 'semantic-ui-react';

interface Props {
  attendees: Profile[];
}

const ActivityListItemAttendee: React.FC<Props> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <Popup
          hoverable
          key={attendee.username}
          trigger={
            <List.Item as={Link} to={`/profiles/${attendee.username}`}>
              <Image
                size="mini"
                circular
                src={attendee.image || '/assets/user.png'}
              />
            </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={attendee} />
          </Popup.Content>
        </Popup>
      ))}
    </List>
  );
};

export default observer(ActivityListItemAttendee);
