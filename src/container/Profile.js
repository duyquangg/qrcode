import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { Actions } from 'react-native-router-flux';
import Firebase from '../components/firebase/FirebaseConfig';
import ls from '../lib/localStorage';
import * as globalActions from '../reducers/global/globalActions';

class Profile extends React.Component {
  handleSignout = () => {
    Firebase.auth().signOut();
    ls.removeLogin();
    Actions.Login();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Profile Screen</Text>
        <Text>{this.props.global.email}</Text>
        <Button title='Logout' onPress={this.handleSignout} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
const actions = [
  globalActions
];
const mapDispatchToProps = dispatch => {
  const creators = Map()
    .merge(...actions)
    .filter(value => typeof value === 'function')
    .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  };
}
const mapStateToProps = state => {
  return {
    ...state
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)