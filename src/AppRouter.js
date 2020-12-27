import React, { Component } from "react";
import { StyleSheet, Platform, View, Text, StatusBar } from "react-native";
import {
  Router,
  Scene,
  Tabs,
} from "react-native-router-flux";
import TabIcon from "./components/icons/TabIcon";


import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Scan from "./container/Scan";
import Profile from "./container/Profile";

//login
import Login from "./components/login/Login";
import Signup from "./components/login/Signup";

//scan
import CheckIn from "./components/scan/CheckIn";
import CheckOut from "./components/scan/CheckOut";
import AddReason from "./components/scan/AddReason";

//profile
import EditInfo from "./components/profile/EditInfo";
import History from "./components/profile/History";

import gui from './lib/gui';
import ls from './lib/localStorage';

import * as globalActions from './reducers/global/globalActions';
const actions = [globalActions];

function mapStateToProps(state) {
  return {
    ...state
  };
}

function mapDispatchToProps(dispatch) {
  const creators = Map()
    .merge(...actions)
    .filter(value => typeof value === 'function')
    .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch,
  };
}
class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {
    // let currentUser = this.props.global.currentUser;
    // console.log('===> currentUser', currentUser);
  }
  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.global.loggedIn !== this.props.global.loggedIn){
      return nextProps;
    }
    return false;
  }

  render() {
    let loggedIn = this.props.global.loggedIn;
    return (
      <View style={styles.container}>
        <StatusBar barStyle={"dark-content"} />
        <Router>
          <Scene
            key="root"
            hideNavBar={true}
            // navigationBarStyle={styles.topNavBar}
            titleStyle={styles.topNavBarTitle}
          >
            <Tabs
              key="Main"
              tabBarPosition="bottom"
              lazy
              tabs
              // data={this.state.data}
              hideNavBar
              activeBackgroundColor="transperent" //bg khi click vao icon
              tabBarStyle={[styles.bottomTabBar, { backgroundColor: '#fff' }]} // bg bottomBar
              labelStyle={styles.bottomTabTitle}
              activeTintColor={gui.mainColor} //cùng màu với màu icons
              inactiveTintColor={'#4b515d'}
              initial={loggedIn}
            >
              <Scene
                key="Scan"
                component={Scan}
                hideNavBar //tự sinh height on Top
                title="Scan"
                // initial
                icon={TabIcon}
              />
              <Scene
                key="Profile"
                // initial
                component={Profile}
                hideNavBar
                title="Cá nhân"
                icon={TabIcon}
              />
            </Tabs>
            <Scene
              key="Login"
              component={Login}
              initial={!loggedIn}
              title="Login"
            />
            <Scene
              key="Signup"
              // initial
              component={Signup}
              title="Signup"
            />
            <Scene
              key="CheckIn"
              // initial
              gesturesEnabled= {false} //k cho back lại
              component={CheckIn}
              title="CheckIn"
            />
            <Scene
              key="CheckOut"
              // initial
              gesturesEnabled= {false} //k cho back lại
              component={CheckOut}
              title="CheckOut"
            />
            <Scene
              key="AddReason"
              // initial
              gesturesEnabled= {false} //k cho back lại
              component={AddReason}
              title="AddReason"
            />
            <Scene
              key="EditInfo"
              // initial
              component={EditInfo}
              title="EditInfo"
            />
            <Scene
              key="History"
              // initial
              component={History}
              title="History"
            />
          </Scene>
        </Router>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNavBar: {
    // backgroundColor: Colors.coral,
    backgroundColor: "red",
    // remove bottom border
    borderBottomWidth: 0,
    elevation: 0,
  },
  topNavBarTitle: {
    // fontFamily: "SFUIDisplay-Semibold",
    color: "#fff",
    fontSize: 21,
    marginBottom: Platform.OS === "ios" ? 14 : 0,
  },
  topTabBar: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  bottomTabBar: {
    height: 55,
    marginBottom: 5,
    borderTopWidth: Platform.OS === "ios" ? 1 : 0.8,
    borderTopColor: "gray",
    paddingVertical: 10,
  },
  bottomTabTitle: {
    // fontFamily: "SFUIDisplay-Bold",
    fontSize: 13,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);