import React from 'react';
import { Header, Menu } from 'semantic-ui-react';

const ActivityFilters = () => {
  return (
    <>
      <Menu vertical size="large" style={{ width: '100%' }}>
        <Header icon="filter" attached color="teal" content="Filters" />
        <Menu.Item content="All Activities" />
        <Menu.Item content="I'm Going" />
        <Menu.Item content="I'm Hosting" />
      </Menu>
      <Header />
    </>
  );
};

export default ActivityFilters;
