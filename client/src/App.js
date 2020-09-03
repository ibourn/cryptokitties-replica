import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/colors.css';
import './assets/css/frontend.css';
import './assets/css/mystyle.css';

import MetamaskNeeded from './components/Connection/MetamaskNeeded';
import UnlockNeeded from './components/Connection/UnlockNeeded';
import KittiesFactory from './components/Pages/KittiesFactory';
import {TxProvider} from './components/Transactions/TxContext';

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
          
            <Switch>
              
              <Route exact strict path="/" component={KittiesFactory} />
              
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
