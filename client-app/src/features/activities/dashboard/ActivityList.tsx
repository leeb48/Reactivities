import { Activity } from 'app/models/activity';
import { useStore } from 'app/stores/store';
import React, { useState } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';

interface Props {
  activities: Activity[];
  deleteActivity: (id: string) => void;
  submitting: boolean;
}

const ActivityList: React.FC<Props> = ({
  activities,
  deleteActivity,
  submitting,
}) => {
  const [target, setTarget] = useState('');

  function handleActivityDelete(
    e: React.SyntheticEvent<HTMLButtonElement>,
    id: string
  ) {
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }

  const { activityStore } = useStore();
  const { selectActivity } = activityStore;

  return (
    <Segment>
      <Item.Group divided>
        {activities.map((activity) => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  onClick={() => selectActivity(activity.id)}
                  floated="right"
                  content="View"
                  color="blue"
                />

                <Button
                  onClick={(e) => handleActivityDelete(e, activity.id)}
                  floated="right"
                  content="Delete"
                  color="red"
                  loading={submitting && target === activity.id}
                  name={activity.id}
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default ActivityList;
