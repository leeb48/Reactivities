import { Activity } from 'app/models/activity';
import React from 'react';
import { Button, Card, Icon, Image } from 'semantic-ui-react';

interface Props {
  activity: Activity;
  cancleSelectActivity: () => void;
}

const ActivityDetails: React.FC<Props> = ({
  activity,
  cancleSelectActivity,
}) => {
  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity.category.toLowerCase()}.jpg`}
      />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{activity.date}</span>
        </Card.Meta>
        <Card.Description>{activity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths="2">
          <Button basic color="blue" content="Edit" />
          <Button
            onClick={cancleSelectActivity}
            basic
            color="grey"
            content="Cancel"
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default ActivityDetails;
