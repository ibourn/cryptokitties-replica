import React from 'react';
import { withRouter, useHistory } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

import StyledNavLink from './StyledNavLink';

/**
 * Main navbar
 * 
 * - custom links and dropdown items to hack the default css behavior
 * 
 * @todo: known issue: react-bootstrap collapse => Warning: findDOMNode is deprecated in StrictMode
 * /add a ref or ?
 */
  const MainNavBar = (props) => {

const dropdownLinkStyle = { backgroundColor: 'inherit' };

const styleHome = props.location.pathname.search("/Market") < 0 ? {display: 'none'} : {display: 'block'};
const styleMarket = props.location.pathname.search("/Market") >= 0 ? {display: 'none'} : {display: 'block'};

const history = useHistory();

    const handleClick = (e) => {
        e.preventDefault();
        history.push(e.target.pathname);
    }

return (
    <Navbar collapseOnSelect expand="lg" className="px-md-5"
      style={{ background: 'linear-gradient(180deg, rgba(248,248,248,1) 0%,  rgba(238,238,238,1) 100%)' }}>

      <Navbar.Brand href="#home" className="navbar-brand">
        Academy-Kitties
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav"/>

      <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
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

      <Button size="sm" className="red-btn" style={styleMarket}>
        <Nav.Link href="/Market" eventKey="/Market" onClick={handleClick} style={{color: 'white', margin: '0', padding: '0'}}>Market Place</Nav.Link>
        </Button>
        
        <Button size="sm" className="red-btn" style={styleHome}>
        <Nav.Link href="/Home" eventKey="/Home" onClick={handleClick} style={{color: 'white', margin: '0', padding: '0'}} >Home</Nav.Link>
      </Button>
    </Navbar>
  );

}


export default withRouter(MainNavBar);