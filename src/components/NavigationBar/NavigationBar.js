import React, {Component, Fragment} from "react";
import $ from "jquery";
import autoBind from 'react-autobind'
import {AppBar, Slide, Typography, Toolbar, Tabs, Tab, CssBaseline} from "@material-ui/core";
import {ReactComponent as Logo} from '../../assets/svgs/logo.svg';

// function DisappearingScrollView(props) {
//   const {children, window} = props;
//
//   return (
//       <Slide appear={false} direction="down" in={!window}>
//         {children}
//       </Slide>
//   );
// }

export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      selectedTab: 'am-home'
    };

    this.appBar = React.createRef();

  }

  render() {
    const {window} = this.props;
    return (
        <Fragment>
          <CssBaseline/>
          <Slide appear={false} direction="down" in={!window}>
            <AppBar ref={this.appBar} id={'am-app-bar'} position='sticky'>
              <Toolbar>

                <Typography variant='h4' color='inherit' align='left' style={styles.logo}>
                  <Logo height={60} width={60}/>
                </Typography>

                {/*<Logo height={50} width={50}/>*/}


                {/*<div align='left'>*/}
                  {/*<Logo/>*/}
                {/*  Andres mejia*/}
                {/*</div>*/}

                <Tabs value={this.state.selectedTab} onChange={this._tabOnClickHandler} aria-label='Menu Tabs'>
                  <Tab disableTouchRipple={true} label='Home' value={'am-home'}/>
                  <Tab disableTouchRipple={true} label='About' value={'am-about'}/>
                  <Tab disableTouchRipple={true} label='Skills' value={'am-skills'}/>
                  <Tab disableTouchRipple={true} label='Work History' value={'am-work-history'}/>
                  <Tab disableTouchRipple={true} label='Projects' value={'am-projects'}/>
                  <Tab disableTouchRipple={true} label='References' value={'am-references'}/>
                </Tabs>
              </Toolbar>

            </AppBar>
          </Slide>
        </Fragment>
    );
  }

  _tabOnClickHandler(events, selectedTab) {
    $(`.${selectedTab}`).click(this.scrollTo(selectedTab));
    this.setState({selectedTab});
  }

  scrollTo(className) {
    $('html,body').animate({scrollTop: $(`.${className}`).offset().top - this.appBar.current.offsetHeight}, 'slow');
  }
}

const styles = {
  logo: {
    flexGrow: 1,
    paddingTop: '1%'
  }
};