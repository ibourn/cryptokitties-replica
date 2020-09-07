import React, { useState } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

import StyledNavLink from './StyledNavLink';

/**
 * Main navbar
 * 
 * - custom links and dropdown items to hack the default css behavior
 */
export default function MainNavBar() {
  const [dropdownLinkStyle, setDropdownLinkStyle] = useState({ backgroundColor: 'inherit' });

  const handleClick = () => {
    setDropdownLinkStyle({ backgroundColor: 'white' });
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="px-md-5"
      style={{ background: 'linear-gradient(180deg, rgba(248,248,248,1) 0%,  rgba(238,238,238,1) 100%)' }}>

      <Navbar.Brand href="#home" className="navbar-brand">
        Academy-Kitties
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />

      <Navbar.Collapse href="responsive-navbar-nav" className="justify-content-end">
        <Nav >
          <StyledNavLink link='Home' dropdown={false}></StyledNavLink>
          <StyledNavLink link='Catalogue' dropdown={false}></StyledNavLink>
          <StyledNavLink link='Factory' dropdown={false}></StyledNavLink>

          <NavDropdown title="History" id="collasible-nav-dropdown" >
            <NavDropdown.Item href="RegisterOfBirths" style={dropdownLinkStyle}>
              <StyledNavLink link='RegisterOfBirths' dropdown={true}></StyledNavLink>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="MyHistory" style={dropdownLinkStyle}>
              <StyledNavLink link='MyHistory' dropdown={true}></StyledNavLink>
            </NavDropdown.Item>
          </NavDropdown>

        </Nav>
      </Navbar.Collapse>

      <Button size="sm" className="red-btn">
        Start
      </Button>
    </Navbar>
  );

}