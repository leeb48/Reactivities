import { useStore } from 'app/stores/store';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Calendar from 'react-calendar';
import { Header, Menu } from 'semantic-ui-react';

const ActivityFilters = () => {
  const {
    activityStore: { predicate, setPredicate },
  } = useStore();

  return (
    <>
      <Menu vertical size='large' style={{ width: '100%', marginTop: 25 }}>
        <Header icon='filter' attached color='teal' content='Filters' />
        <Menu.Item
          content='All Activities'
          active={predicate.has('all')}
          onClick={() => setPredicate('all')}
        />
        <Menu.Item
          content="I'm Going"
          active={predicate.has('isGoing')}
          onClick={() => setPredicate('isGoing')}
        />
        <Menu.Item
          content="I'm Hosting"
          active={predicate.has('isHosting')}
          onClick={() => setPredicate('isHost')}
        />
      </Menu>
      <Header />
      <Calendar
        onChange={(date) => setPredicate('startDate', date as Date)}
        value={predicate.get('startDate') || new Date()}
      />
    </>
  );
};

export default observer(ActivityFilters);
