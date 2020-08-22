import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/colors.css';
import './assets/css/frontend.css';
import './assets/css/mystyle.css';
import KittiesFactory from './components/Pages/KittiesFactory';
import './App.css';

function App() {
  return (

    // <ThemeProvider theme={globalThemeToProvide}>
      <BrowserRouter>
          {/* <div className="globalContainer container-fluid" > */}
          
            <Switch>
              
              <Route exact strict path="/" component={KittiesFactory} />
              
            </Switch>

          {/* </div> */}
      </BrowserRouter>
    // </ThemeProvider>

  );
}

export default App;
