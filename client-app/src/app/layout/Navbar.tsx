import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';

const Navbar = () => {
  return (
    <>
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={NavLink} exact to="/" header>
            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ marginRight: '10px' }}
            />
            Reactivities
          </Menu.Item>
          <Menu.Item as={NavLink} exact to="/activities" name="Activities" />
          <Menu.Item as={NavLink} exact to="/errors" name="Test Errors" />
          <Menu.Item>
            <Button
              as={NavLink}
              exact
              to="/createActivity"
              positive
              content="Create Activity"
            />
          </Menu.Item>
        </Container>
      </Menu>
    </>
  );
};

export default Navbar;
