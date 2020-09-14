import React, { useState } from 'react';
import { BrowserRouter, Switch, Route, withRouter, useHistory } from 'react-router-dom';

import styled from 'styled-components';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import '../../assets/css/home.css';

const Div = styled.div`
    a.link{
        color: white;
        margin: 0;
        padding: 0;
    }
    link:hover{
        border: 1px solid white;
    }
    link:active{
        border: 1px solid white;
        background-color: white;
        color: black;
    }
`

/**
 * Landing Page
 */
const MarketNavBar = (props) => {

    const [page, setPage] = useState("");
const history = useHistory();
    const activeKeyStyle = props.location.pathname;

    const handleClick = (e) => {
        e.preventDefault();
        history.push(e.target.pathname);
    }
    return (

        // <Navbar>
        <Div>
            <Nav fill variant="tabs" defaultActiveKey={activeKeyStyle} className="pt-3">

                <Nav.Item>
                    <Nav.Link className="link" href="/Market/Buy" eventKey="/Market/Buy" onClick={handleClick}>Buy a kitty</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link className="link" href="/Market/OnSale" eventKey="/Market/OnSale" onClick={handleClick}>Your kitties on sale</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link className="link" href="/Market/Borrow" eventKey="/Market/Borrow" onClick={handleClick}>Borrow a sire</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link className="link" href="/Market/Rented" eventKey="/Market/Rented" onClick={handleClick}>Your sires for rental</Nav.Link>
                </Nav.Item>
            </Nav>
        </Div>
        // </Navbar>


    )
}

export default withRouter(MarketNavBar);