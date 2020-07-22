import React, { Component } from 'react'
import Home from './MainPage';
import StudentResources from './StudentResourcesPage';
import './css/auto-complete.css'
import './css/index.css'
import './css/skeleton.css'
import lightMode from './css/lightMode.module.css'
import darkMode from './css/darkMode.module.css'
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import {
  HashRouter as Router,
  Switch,
  Route} from 'react-router-dom';
import { Paper } from '@material-ui/core';

export class App extends Component {
  theme = () => (createMuiTheme({
    palette: {
      type: this.state.darkMode ? "dark" : "light"
    }
  }));
  constructor(props){
    super(props);
    this.state = {darkMode: true};
  }

  switchTheme = () => {
    console.log('switch them in app')
    this.setState({darkMode: !this.state.darkMode});
  }

  render() {
    return (
      <ThemeProvider theme = {this.theme()}>
        <Paper>
          <div className= 'App'>
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
        </Paper>
      </ThemeProvider>

    );
  }

}


export default App
