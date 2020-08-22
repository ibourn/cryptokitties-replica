import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/colors.css';
import './assets/css/frontend.css';
import './assets/css/mystyle.css';
import KittiesFactory from './components/Pages/KittiesFactory';

function App() {
  return (

      <BrowserRouter>
          
            <Switch>
              
              <Route exact strict path="/" component={KittiesFactory} />
              
            </Switch>

      </BrowserRouter>

  );
}

export default App;
