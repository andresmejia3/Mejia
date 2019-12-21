import React, {Component} from 'react';
import NavigationBar from '../components/NavigationBar/NavigationBar'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';
import {AppColors} from "../utils/constant";
import About from "../pages/about/About";
import Home from "../pages/home/Home";
import Projects from "../pages/projects/Projects";
import References from "../pages/references/References";
import WorkHistory from "../pages/workHistory/WorkHistory";
import Skills from "../pages/skills/Skills";
import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: AppColors.primaryColorString,
      contrastText: '#ffffff'
    },
    secondary: {
      main: AppColors.secondaryColorString,
      contrastText: '#000000'
    },
  }
});

class App extends Component {

  constructor(props) {
    super(props);

    document.body.style.background = AppColors.primaryColorString;
  }

  componentDidMount() {
    // const os = new OnScreen();

    // os.on('leave', `#${NodeNetworkAnimation.NODE_NETWORK_PIXI_ID}`, (element, event) => {
    //   alert("LEFT PIXI")
    // });
    //
    // os.on('enter', `#${NodeNetworkAnimation.NODE_NETWORK_PIXI_ID}`, (element, event) => {
    //   console.log('enter:', element);
    //   alert("ENTER PIXI")
    //
    //   // `event` is a string that tells you what type of event it is.
    //   // in this case it would be 'leave'
    // });
  }

  render() {
    return (
        <MuiThemeProvider theme={theme}>
          <div className="App">
            <NavigationBar/>
            <Home/>
            <About/>
            <Skills/>
            <WorkHistory/>
            <Projects/>
            <References/>
          </div>
        </MuiThemeProvider>
    );
  }
}

export default App;
