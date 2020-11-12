import React, { useEffect, useState } from "react";
import { StyleSheet, Platform, View, Text, StatusBar } from "react-native";
import {
  Router,
  Scene,
  Tabs,
} from "react-native-router-flux";
import TabIcon from "./components/icons/TabIcon";


import Home from "./container/Home";
import Profile from "./container/Profile";

//login
import Login from "./components/login/Login";
import Signup from "./components/login/Signup";

const AppRouter = (props) => {
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
            hideNavBar
            activeBackgroundColor="transperent" //bg khi click vao icon
            tabBarStyle={[styles.bottomTabBar, { backgroundColor: '#fff' }]} // bg bottomBar
            labelStyle={styles.bottomTabTitle}
            activeTintColor={'red'} //cùng màu với màu icons
            inactiveTintColor={'#000'}

          // initial={isLogin}
          >
            <Scene
              key="Home"
              component={Home}
              hideNavBar //tự sinh height on Top
              title="Trang chủ"
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
            // initial
            component={Login}
            title="Login"
          />
          <Scene
            key="Signup"
            // initial
            component={Signup}
            title="Signup"
          />
        </Scene>
      </Router>
    </View>
  );
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
    height: 65,
    borderTopWidth: Platform.OS === "ios" ? 1 : 0.8,
    borderTopColor: "gray",
    paddingVertical: 10,
  },
  bottomTabTitle: {
    // fontFamily: "SFUIDisplay-Bold",
    fontSize: 13,
  },
});

export default AppRouter;