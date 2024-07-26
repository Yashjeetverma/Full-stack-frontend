import React, { useEffect, useState } from 'react';

//bootstrap
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../actions/authActions';


function Dashboard({ handleLogout }) {

  const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    setUserToken(userToken)
    if (userToken) {
      dispatch(fetchUserData(userToken));
    }
  }, [dispatch]);

  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/home">Dashboard</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {user ? user.fullName : 'User'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Dashboard;
