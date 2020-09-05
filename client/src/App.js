import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/colors.css';
import './assets/css/frontend.css';
import './assets/css/mystyle.css';

import MetamaskNeeded from './components/Connection/MetamaskNeeded';
import UnlockNeeded from './components/Connection/UnlockNeeded';
import HomePage from './components/Pages/HomePage';
import KittiesFactory from './components/Pages/KittiesFactory';
import Catalogue from './components/Pages/Catalogue';
import MyHistory from './components/Pages/KittiesHistory/MyHistory';
import RegisterOfBirths from './components/Pages/KittiesHistory/RegisterOfBirths';
import MainNavBar from './components/NavBars/MainNavBar';
import ConnectionBanner from './components/Connection/ConnectionBanner';
import { TxProvider } from './components/Transactions/TxContext';

/**
 * Main Component
 * 
 * - import global css;
 * - render :
 *  - modal box : displayed if provider is not detected
 *  - routes
 */
function App() {

  return (
    <div className="main__container">

      <MetamaskNeeded ></MetamaskNeeded>
      <UnlockNeeded ></UnlockNeeded>
      <TxProvider>
        <BrowserRouter>

          <div className="sticky-top">
            <MainNavBar></MainNavBar>
            <ConnectionBanner></ConnectionBanner>
          </div>

          <Switch>

            <Route exact strict path="/" component={HomePage} />
            <Route exact strict path="/Factory" component={KittiesFactory} />
            <Route exact strict path="/Catalogue" component={Catalogue} />
            <Route exact strict path="/RegisterOfBirths" component={RegisterOfBirths} />
            <Route exact strict path="/MyHistory" component={MyHistory} />
          </Switch>

        </BrowserRouter>
      </TxProvider>
      <footer align="left">
        <p>Ivan on Tech Academy Bootcamp July 2020</p>
      </footer>
    </div>
  );
}

export default App;
