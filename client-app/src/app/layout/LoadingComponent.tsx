import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
  inverted?: boolean;
  content?: string;
}

const LoadingComponent: React.FC<Props> = ({
  inverted = true,
  content = 'Loading...',
}) => {
  return (
    <Dimmer active={true} inverted={inverted}>
      <Loader content={content} />
    </Dimmer>
  );
};

export default LoadingComponent;
