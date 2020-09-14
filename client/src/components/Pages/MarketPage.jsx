import React, { useState } from 'react';
import { BrowserRouter, Switch, Route, withRouter } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

import MarketMenu from '../NavBars/MarketMenu';
import MarketNavBar from '../NavBars/MarketNavBar';
import BuyPage from './MarketPlace/BuyPage';
import OnSalePage from './MarketPlace/OnSalePage';
import BorrowPage from './MarketPlace/BorrowPage';
import RentedPage from './MarketPlace/RentedPage';
import HomePage from '../Pages/HomePage';
import HomeCard from '../Cards/HomeCard';
import { Random } from '../../assets/modules/utils';

import '../../assets/css/home.css';



/**
 * Landing Page
 */
export default function MarketPage(props) {

    // const [page, setPage] = useState("");

    // m-sm-4 m-1
    const page = props.location.pathname;

    return (
        <div className="container-fluid" style={{ background: '#607d8b', height: '75vh' }}>
        { page === "/Market" ?
        <MarketMenu></MarketMenu>

                :
                <>
                <MarketNavBar></MarketNavBar>
                <Switch>
                <Route  path="/Market/Buy" component={BuyPage} />
                <Route exact  path="/Market/OnSale" component={OnSalePage} />
                <Route exact strict path="/Market/Rented" component={RentedPage} />
                <Route exact strict path="/Market/Borrow" component={BorrowPage} />          
            </Switch>
</>
}
        </div>

    )
}