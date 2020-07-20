import React, { Component } from 'react'
import Home from './MainPage';
import StudentResources from './StudentResourcesPage';
import './css/auto-complete.css'
import './css/index.css'
import './css/skeleton.css'
import {
  HashRouter as Router,
  Switch,
  Route} from 'react-router-dom';

export class App extends Component {
  render() {
    return (
      <div className="App">
        <Router /*basename={process.env.PUBLIC_URL}*/>
          <Switch>
            <Route path="/StudentResources">
              <StudentResources />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }

}


export default App
