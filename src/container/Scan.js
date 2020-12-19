import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  Dimensions,
  ScrollView,
  RefreshControl
} from 'react-native';
const { width, height } = Dimensions.get('window');

import moment from 'moment';
import { Actions } from 'react-native-router-flux';

import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import Loader from '../components/icons/Loader';
import HeaderScan from '../components/header/HeaderScan';
import Toast from "../components/toast/Toast";
import gui from '../lib/gui';
import userApi from '../lib/userApi';
import * as globalActions from '../reducers/global/globalActions';

class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCheck: {},
      loading: false
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = async () => {
    let dto = {
      userID: this.props.global.currentUser.userID
    };
    let resGetTimeByUser = await userApi.timeGetByUserID(dto);
    if (resGetTimeByUser.status == 200) {
      let data = resGetTimeByUser.data[0];
      this.setState({ dataCheck: data })
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this._renderHeader()}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this.fetchData.bind(this)}
              tintColor={'#34626c'}
            />
          }
        >
          {this._renderBody()}
        </ScrollView>
        <Toast
          ref="toastTop"
          position='top'
          positionValue={70}
          fadeInDuration={1000}
          fadeOutDuration={2000}
          opacity={0.85}
          textStyle={{ color: 'white', fontWeight: '600', textAlign: 'center' }}
        />
      </View>
    );
  }
  _renderHeader = () => {
    let title = this.props.global.currentUser.fullName ? this.props.global.currentUser.fullName : null;
    let avatar = this.props.global.currentUser.avatar ? this.props.global.currentUser.avatar : null;
    return (
      <HeaderScan
        titleScan={title + '!'}
        source={avatar}
      />
    )
  };
  _renderBody = () => {
    let { dataCheck } = this.state;
    let timeCheckin = null;
    let timeCheckout = null;
    dataCheck ? timeCheckin = dataCheck.checkInTime : null;
    dataCheck ? timeCheckout = dataCheck.checkOutTime : null;
    return (
      <View>
        {timeCheckin ?
          <Text style={{ marginTop: 10, marginHorizontal: 16 }}>Hôm nay bạn checkin lúc {''}
            {moment(timeCheckin).format('LT' + ' - ' + 'DD/MM/YYYY')}
          </Text>
          : <Text style={{ marginTop: 10, marginHorizontal: 16 }}>Hôm nay bạn chưa checkin rồiiii!</Text>
        }
        {timeCheckout ?
          <Text style={{ marginTop: 10, marginHorizontal: 16 }}>Hôm nay bạn checkout lúc {''}
            {moment(timeCheckout).format('LT' + ' - ' + 'DD/MM/YYYY')}
          </Text>
          : <Text />
        }
        <View style={styles.viewButton}>
          <TouchableOpacity style={styles.viewPress} onPress={this.checkIn.bind(this)}>
            <Text style={{ color: '#fff' }}>Checkin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewPress} onPress={this.checkOut.bind(this)}>
            <Text style={{ color: '#fff' }}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  checkIn = () => {
    let { dataCheck } = this.state;
    if (dataCheck == null) {
      Actions.checkIn({ dataCheck, doRefresh: this.fetchData.bind(this) });
    } else {
      this.refs.toastTop.show("Bạn đã checkIn ngày hôm nay rồi!");
    }
  }
  checkOut = () => {
    let { dataCheck } = this.state;
    if (dataCheck == null) {
      return this.refs.toastTop.show("Bạn phải checkIn trước đã!");
    }
    Actions.checkOut({ dataCheck, doRefresh: this.fetchData.bind(this) });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  viewButton: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: gui.screenWidth - 32,
    marginLeft: 16
  },
  viewPress: {
    height: 60,
    width: (gui.screenWidth - 32 - 20) / 2,
    marginTop: 20,
    borderRadius: 10,
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