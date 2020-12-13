import React, {Component} from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { Actions } from 'react-native-router-flux';
import Firebase from '../components/firebase/FirebaseConfig';
import ls from '../lib/localStorage';
import * as globalActions from '../reducers/global/globalActions';

class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: null,
    };
    console.log('======> checkIn',props.global.checkIn) //nên lấy từ database ra
  }
  componentDidMount() {
        ls.getLoginInfo().then(ls => {
          this.setState({email: ls.email})
        })
  }
  onActionsPress() {
    Alert.alert('Thông báo', 'Bạn có chắc chắn muốn đăng xuất?', [
      {
        text: 'Huỷ',
        onPress: () => console.info('Cancel Pressed'),
      },
      {
        text: 'OK',
        onPress: () => this.onPressSignOut()
      }
    ],
      { cancelable: false },
    )
  }

  onPressSignOut = async () => {
     // Firebase.auth().signOut();
    await ls.removeLogin();
    Actions.Login({ type: 'reset' });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Profile Screen</Text>
        <Text>{this.state.email}</Text>
        <Button title='Logout' onPress={this.onActionsPress.bind(this)} />
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