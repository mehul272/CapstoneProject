import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../images/etl_logo.png';

function AppNavbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">
        <img src={logo} alt="My Company Logo" height="50" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
        
          <Nav.Link href="Login">Login/SignUp</Nav.Link>
          <Nav.Link href="#architecture">Architecture</Nav.Link>
          <Nav.Link href="#docs">Documentations</Nav.Link>
          <Nav.Link href="https://github.com/mehul272/CapstoneProject/tree/main">GitHub</Nav.Link>
          <Nav.Link href="#contact">Contact Us</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;

