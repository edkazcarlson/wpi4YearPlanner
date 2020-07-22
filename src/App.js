import React, { Component } from 'react'
import Home from './MainPage';
import StudentResources from './StudentResourcesPage';
import './css/auto-complete.css'
import './css/index.css'
import './css/skeleton.css'
import lightMode from './css/lightMode.module.css'
import darkMode from './css/darkMode.module.css'
import {
  HashRouter as Router,
  Switch,
  Route} from 'react-router-dom';

export class App extends Component {
  constructor(props){
    super(props)
    this.state = {darkMode: true}
  }

  switchTheme = () => {

  }

  render() {
    let currentStyle = this.state.darkMode ? darkMode : lightMode; 
    return (
      <div className="App" className={currentStyle.darkMode}>
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
