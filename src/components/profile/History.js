import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Toast from "../toast/Toast";
import CommonHeader from '../header/CommonHeader';
import gui from '../../lib/gui';
import userApi from '../../lib/userApi';
import utils from '../../lib/utils';

import * as globalActions from '../../reducers/global/globalActions';

const actions = [
  globalActions
];

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
    dispatch
  };
}
class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUser: [],
      loading: false
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = async () => {
    let dtoUser = {
      userID: this.props.global.currentUser.userID,
      role: this.props.global.currentUser.role,
    };
    let resGetHistory = await userApi.getHistory(dtoUser);
    console.log('====> resGetHistory', resGetHistory)
    if (resGetHistory.status == 200) {
      let data = resGetHistory.data;
      this.setState({ dataUser: data })
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this._renderHeader()}
        {this._renderBody()}
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
  _renderHeader() {
    return (
      <CommonHeader
        title={"Lịch sử"}
        leftContent={<FontAwesome name={'chevron-left'} color={'#fff'} size={20} />}
        onPressLeft={() => Actions.pop()}
      />
    );
  }
  _renderBody() {
    let { dataUser } = this.state;
    if (dataUser.length == 0) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text>Không có lịch sử checkin/checkout nào cả!</Text>
        </View>
      )
    };
    return (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this.fetchData.bind(this)}
            tintColor={'#34626c'}
          />
        }
        style={{ backgroundColor: '#fff', flex: 1 }}
        contentContainerStyle={{ paddingTop: 10, marginBottom: 10 }}
        data={dataUser}
        renderItem={({ item, index }) => {
          return (
            <FlatListItem item={item} index={index}
            // doRefreshData={this._onRefresh.bind(this)}
            />
          );
        }}

        keyExtractor={(item, index) => item.id.toString()}
        ListFooterComponent={this.ListFooterComponent()}
        // ListHeaderComponent={() => {
        //   return (
        //     <Text>vv</Text>
        //   )
        // }}
        removeClippedSubviews={false}
        enableEmptySections
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={10}
        initialListSize={20}
        onEndReachedThreshold={0}
      // onEndReached={debounce(this.onEndReached.bind(this), 300)}
      />
    );
  };

  ListFooterComponent = () => {
    let showReadMoreJSX = (
      <TouchableOpacity
        style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}
      >
        {/* <PacmanIndicator color={gui.mainColor} /> */}
        <Text>ahihi</Text>
      </TouchableOpacity>
    );
    if (this.state.loading === true) {
      return (
        <View>
          {showReadMoreJSX}
        </View>
      );
    }
  };
}
class FlatListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    let { item, index, doRefreshData } = this.props;
    let imageDefault = require('../../assets/images/user.png');
    // console.log('===> item', item);
    let time = moment(item.checkInTime).format('HH:mm');
    let correctTime = "09:00";
    let minus = utils.parseTime(time) - utils.parseTime(correctTime);
    let afterCheckTime = minus > 0 ? utils.convertMinsToHrsMins(minus) : null;
    return (
      <View
        style={styles.viewItem}
        key={item.id}
        activeOpacity={1}
      // onPress={this._onPress.bind(this, item, index)}
      >
        <View style={styles.viewInItem}>
          <View style={styles.viewRowTime}>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.textName}>{item.fullName}</Text>
              {item.checkInTime ?
                this._renderRowTime('caret-right', `${moment(item.checkInTime).format('LT' + ' | ' + 'DD/MM/YYYY')}`)
                : null
              }
              {item.checkOutTime ?
                this._renderRowTime('caret-left', `${moment(item.checkOutTime).format('LT' + ' | ' + 'DD/MM/YYYY')}`)
                : null
              }
            </View>
          </View>
          {minus > 0 ?
            <View style={styles.viewWarming}>
              <FontAwesome name={'exclamation'} color={'red'} size={15} />
              <Text style={styles.textWarming}>Muộn {afterCheckTime}'</Text>
            </View>
            : null
          }
        </View>
        <View style={styles.viewLine} />
      </View>
    );
  }
  _renderRowTime = (name, value) => {
    return (
      <View style={styles.viewRowTime}>
        <FontAwesome name={name} color={'gray'} size={20} />
        {value ?
          <Text style={styles.timeText}>{value}</Text>
          : <Text />
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewItem: {
    // marginHorizontal: 16,
    marginTop: 10,
    // backgroundColor: 'yellow'
  },
  viewInItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'green'
  },
  textName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },
  viewImage: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  viewRowTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 8
  },
  viewWarming: {
    alignItems: 'center',
    marginRight: 16
  },
  textWarming: {
    fontStyle: 'italic',
    fontSize: 13,
    color: '#ff4646'
  },
  viewLine: {
    height: 1,
    backgroundColor: 'gray',
    marginTop: 3,
    width: gui.screenWidth
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(History);