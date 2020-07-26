import React, { Component } from 'react'
import Home from './MainPage';
import StudentResources from './StudentResourcesPage';
import './css/auto-complete.css'
import './css/index.css'
import './css/skeleton.css'
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import {
  HashRouter as Router,
  Switch,
  Route} from 'react-router-dom';
import { Paper } from '@material-ui/core';
const darkModeCookieTag = 'darkMode'

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
  componentDidMount(){
    this.setState({darkMode: 
      localStorage.getItem(darkModeCookieTag) != null ? 
      localStorage.getItem(darkModeCookieTag) == 'true': 1 })
  }

  switchTheme = () => {
    this.setState({darkMode: !this.state.darkMode});
    localStorage.setItem(darkModeCookieTag, (!this.state.darkMode).valueOf().toString());
  }

  render() {
    return (
      <ThemeProvider theme = {this.theme()}>
        <Paper style = {{borderRadius: '0px'}} >
          <div className= 'App'>
            <Router /*basename={process.env.PUBLIC_URL}*/>
              <Switch>
                <Route path="/StudentResources">
                  <StudentResources />
                </Route>
                <Route path="/">
                  <Home switchTheme = {this.switchTheme} darkModeState  = {this.state.darkMode}/>
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
