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
    this.setState({darkMode: !this.state.darkMode})
  }

  render() {
    let currentStyle = this.state.darkMode ? darkMode : lightMode; 
    console.log(currentStyle)
    return (
      <div className={'App ', currentStyle.customColor}>
        <Router /*basename={process.env.PUBLIC_URL}*/>
          <Switch>
            <Route path="/StudentResources">
              <StudentResources />
            </Route>
            <Route path="/">
              <Home switchTheme = {this.switchTheme}/>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }

}


export default App
