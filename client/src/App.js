import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/colors.css';
import './assets/css/frontend.css';
import './assets/css/mystyle.css';

import MetamaskNeeded from './components/Connection/MetamaskNeeded';
import UnlockNeeded from './components/Connection/UnlockNeeded';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './components/Pages/HomePage';
import KittiesFactory from './components/Pages/KittiesFactory';
import Catalogue from './components/Pages/Catalogue';
import MyHistory from './components/Pages/KittiesHistory/MyHistory';
import RegisterOfBirths from './components/Pages/KittiesHistory/RegisterOfBirths';

import { Web3Provider } from './components/Connection/Web3Context';
import { TxProvider } from './components/Transactions/TxContext';

/**
 * Main Component
 * 
 * - import global css;
 * - render :
 *  - modal box : displayed if provider is not detected
 *  - routes
 * - provides Web3 and Tx contexts
 */
function App() {

  return (
    <div className="main__container">
      <Web3Provider>
        <MetamaskNeeded ></MetamaskNeeded>
        <UnlockNeeded ></UnlockNeeded>

        <TxProvider>
          <BrowserRouter>

            <Header></Header>
            <Switch>

              <Route exact strict path="/" component={HomePage} />
              <Route exact strict path="/Home" component={HomePage} />
              <Route exact strict path="/Factory" component={KittiesFactory} />
              <Route exact strict path="/Catalogue" component={Catalogue} />
              <Route exact strict path="/RegisterOfBirths" component={RegisterOfBirths} />
              <Route exact strict path="/MyHistory" component={MyHistory} />

            </Switch>

          </BrowserRouter>
        </TxProvider>
      </Web3Provider>
      <Footer></Footer>
    </div>
  );
}

export default App;
