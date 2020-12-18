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
      dataUser: props.global.currentUser,
      dataCheck: {},
      loading: false
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true })
    let dto = {
      userID: this.props.global.currentUser.userID
    };
    let resGetTimeByUser = await userApi.timeGetByUserID(dto);
    if (resGetTimeByUser.status == 200) {
      let data = resGetTimeByUser.data[0];
      this.setState({
        dataCheck: data,
        loading: false
      })
    }
  }
  render() {
    let { dataUser, dataCheck } = this.state;
    let timeCheckin = null;
    let timeCheckout = null;
    dataCheck ? timeCheckin = dataCheck.checkInTime : null;
    dataCheck ? timeCheckout = dataCheck.checkOutTime : null;
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: 100 }}>Xin chào {this.props.global.currentUser.fullName}</Text>
        {timeCheckin ?
          <Text style={{ marginTop: 10 }}>Hôm nay bạn checkin lúc {''}
              {moment(timeCheckin).format('LT' + ' - ' + 'DD/MM/YYYY')}
          </Text>
          : <Text style={{ marginTop: 10 }}>Hôm nay bạn chưa checkin rồiiii!</Text>
        }
        {timeCheckout ?
          <Text style={{ marginTop: 10 }}>Hôm nay bạn checkin lúc {''}
              {moment(timeCheckout).format('LT' + ' - ' + 'DD/MM/YYYY')}
          </Text>
          : <Text />
        }
        <TouchableOpacity style={styles.viewPress} onPress={this.checkIn.bind(this)}>
          <Text>Checkin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewPress} onPress={this.checkOut.bind(this)}>
          <Text>Checkout</Text>
        </TouchableOpacity>
        <Loader loading={this.state.loading} />
      </View>
    );
  }
  checkIn = () => {
    let { dataCheck } = this.state;
    if (dataCheck == null) {
      Actions.checkIn({ dataCheck });
    } else {
      alert('Bạn đã checkIn ngày hôm nay rồi!');
    }
  }
  checkOut = () => {
    let { dataCheck } = this.state;
    if (dataCheck == null) {
      return alert('Bạn phải checkIn trước đã!');
    }
    Actions.checkOut({ dataCheck });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  viewPress: {
    height: 60,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34626c'
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