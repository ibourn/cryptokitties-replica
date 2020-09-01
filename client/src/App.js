import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/colors.css';
import './assets/css/frontend.css';
import './assets/css/mystyle.css';

import MetamaskNeeded from './components/Connection/MetamaskNeeded';
import KittiesFactory from './components/Pages/KittiesFactory';


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

      <BrowserRouter>
          
            <Switch>
              
              <Route exact strict path="/" component={KittiesFactory} />
              
            </Switch>

      </BrowserRouter>
      </div>
  );
}

export default App;
