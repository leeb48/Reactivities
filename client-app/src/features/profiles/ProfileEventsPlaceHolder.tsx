import React from 'react';
import { Grid, Segment, Placeholder, Card } from 'semantic-ui-react';

const ProfileEventsPlaceHolder = () => {
  return (
    <Card.Group itemsPerRow={4} stackable>
      {[0, 1, 2, 3].map((card) => (
        <Card key={card}>
          <Placeholder>
            <Placeholder.Image />
          </Placeholder>
          <Card.Content>
            <Placeholder>
              <Placeholder.Header>
                <Placeholder.Line length='very short' />
                <Placeholder.Line length='medium' />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length='short' />
              </Placeholder.Paragraph>
            </Placeholder>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};

export default ProfileEventsPlaceHolder;
