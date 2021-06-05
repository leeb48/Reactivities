import { Activity } from 'app/models/activity';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Segment, Image, Item, Header, Button, Label } from 'semantic-ui-react';
import { format } from 'date-fns';
import { useStore } from 'app/stores/store';

const activityImageStyle = {
  filter: 'brightness(30%)',
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '15%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white',
};

interface Props {
  activity: Activity;
}

const ActivityDetailedHeader: React.FC<Props> = ({ activity }) => {
  const {
    activityStore: { updateAttendence, loading, cancelActivityToggle },
  } = useStore();

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: '0' }}>
        {activity.isCancelled && (
          <Label
            style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }}
            ribbon
            color="red"
            content="Cancelled"
          />
        )}
        <Image
          src={`/assets/categoryImages/${activity.category.toLocaleLowerCase()}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: 'white' }}
                />
                <p>{format(activity.date!, 'dd MMM yyyy')}</p>
                <p>
                  Hosted by{' '}
                  <strong>
                    <Link to={`/profiles/${activity.host?.username}`}>
                      {activity.host?.displayName}
                    </Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment clearing attached="bottom">
          {activity.isHost ? (
            <>
              <Button
                color={activity.isCancelled ? 'green' : 'red'}
                floated="left"
                basic
                content={
                  activity.isCancelled ? 'Re-activate' : 'Cancel Activity'
                }
                onClick={cancelActivityToggle}
                loading={loading}
              />
              <Button
                disabled={activity.isCancelled}
                as={Link}
                to={`/manage/${activity.id}`}
                color="orange"
                floated="right"
              >
                Manage Event
              </Button>
            </>
          ) : activity.isGoing ? (
            <Button loading={loading} onClick={updateAttendence}>
              Cancel Attendacne
            </Button>
          ) : (
            <Button
              disabled={activity.isCancelled}
              loading={loading}
              onClick={updateAttendence}
              color="teal"
            >
              Join Activity
            </Button>
          )}
        </Segment>
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHeader);
