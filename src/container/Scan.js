import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');

import moment from 'moment';

import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import Loader from '../components/icons/Loader';
import gui from '../lib/gui';
import ls from '../lib/localStorage';
import userApi from '../lib/userApi';
import * as globalActions from '../reducers/global/globalActions';
import { Actions } from 'react-native-router-flux';

class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUser: this.props.global.currentUser,
      dataCheck: {},
    };
  }
  componentDidMount = async () => {
    let dto = {
      userID: this.props.global.currentUser.userID
    };
    let resGetTimeByUser = await userApi.timeGetByUserID(dto);
    if (resGetTimeByUser.status == 200) {
      let data = resGetTimeByUser.data[0];
      this.setState({
        dataCheck: data,
      })
    }
  }
  render() {
    let {dataUser, dataCheck, idCheck} = this.state;
    let timeCheckin = null;
    let timeCheckout = null;
    dataCheck ? timeCheckin = dataCheck.checkInTime : null;
    dataCheck ? timeCheckout = dataCheck.checkOutTime : null;
    return (
      <View style={styles.container}>
        <Text style={{marginTop:100}}>Xin chào {dataUser.fullName}</Text>
        <Text style={{marginTop:10}}>Hôm nay bạn checkin lúc {moment(timeCheckin).format('LT' + ' - ' + 'DD/MM/YYYY')}</Text>
        <Text style={{marginTop:5}}>Hôm nay bạn checkout lúc {moment(timeCheckout).format('LT' + ' - ' + 'DD/MM/YYYY')}</Text>
        <TouchableOpacity style={styles.viewPress} onPress={() => Actions.checkIn({dataCheck})}>
          <Text>Checkin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewPress} onPress={this.checkOut.bind(this)}>
          <Text>Checkout</Text>
        </TouchableOpacity>
      </View>
    );
  }
  checkOut = () => {
    let {dataCheck} = this.state;
    if(dataCheck == null){
     return alert('Bạn phải checkIn trước đã!');
    }
    Actions.checkOut({dataCheck});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  viewPress: {
    height: 60,
    marginTop:20,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#34626c'
  }

});
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
export default connect(mapStateToProps, mapDispatchToProps)(Scan);