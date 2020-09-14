import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

import HomeCard from '../Cards/HomeCard';
import { Random } from '../../assets/modules/utils';

import '../../assets/css/home.css';



/**
 * Landing Page
 */
export default function MarketPage() {

    const [page, setPage] = useState("");

    // m-sm-4 m-1
    return (

        <>
                    <div className="pt-3" align="center">
                        <h1 className="c-white">Market Place</h1>
                    </div>
                    <div className="particle-1"></div>
                    <div className="particle-2"></div>
                    <div className="particle-3"></div>
                    <div className="particle-4"></div>
                    <Navbar className=" d-flex flex-column justify-content-around m-0 p-0" style={{ background: 'transparent', height: '75%' }}>
                        <div className="row  m-0 p-0">
                            <Button size="sm" className="col red-btn mr-md-5 mr-sm-3 mr-1 mb-md-0 mb-1">
                                <Nav.Link href="/Market/Buy" style={{ color: 'white', margin: '0', padding: '0' }}>Buy a kitty</Nav.Link>
                            </Button>
                            <Button size="sm" className="col red-btn ml-md-5 ml-sm-3 ml-1 mt-md-0 mt-1">
                                <Nav.Link href="/Market/OnSale" style={{ color: 'white', margin: '0', padding: '0' }}>Your kitties on sale</Nav.Link>
                            </Button>
                        </div>
                        <div className="row justify-content-between m-0 p-0">
                            <Button size="sm" className="col red-btn mr-md-5 mr-sm-3 mr-1 mb-md-0 mb-1">
                                <Nav.Link href="/Market/Rented" style={{ color: 'white', margin: '0', padding: '0' }}>Borrow a sire</Nav.Link>
                            </Button>
                            <Button size="sm" className="col red-btn ml-md-5 ml-sm-3 ml-1 mt-md-0 mt-1">
                                <Nav.Link href="/Market/Borrow" style={{ color: 'white', margin: '0', padding: '0' }}>Your sires for rental</Nav.Link>
                            </Button>
                        </div>
                    </Navbar>
</>
    )
}