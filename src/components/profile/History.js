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
    let data = [
      {
        checkInTime: 1608279019,
        checkOutTime: 1608291249,
      },
      {
        checkInTime: 1608320923,
        checkOutTime: 1608245649,
      },
      {
        checkInTime: 1608526649,
        checkOutTime: 1601462649
      }
    ]
    this.state = {
      dataCheck: {},
      data,
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
    let { dataCheck, data } = this.state;
    console.log('====> data', data);
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
    let checkRole = this.props.global.currentUser.role;
    console.log('===> checkRole', checkRole);
    let { data } = this.state;
    return (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={false}
          // onRefresh={this._onRefresh.bind(this)}
          />
        }
        style={{ backgroundColor: '#fff', flex: 1 }}
        contentContainerStyle={{ paddingTop: 10, marginBottom: 10 }}
        data={data}
        renderItem={({ item, index }) => {
          return (
            <FlatListItem item={item} index={index}
            // doRefreshData={this._onRefresh.bind(this)}
            />
          );
        }}
        keyExtractor={(item, index) => item.id}
        // ListFooterComponent={this.ListFooterComponent()}
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
    showReadMoreJSX = (
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
      // background: this.props.item.read ? '#fff' : '#f2e9e1',
      // select: null,
      // countDetail: 0,
    };
  }

  render() {
    let { item, index, doRefreshData } = this.props;
    let { checkInTime, checkOutTime } = item;
    console.log('===> item',item);
    return (
      <View
        // key={item.id}
        activeOpacity={1}
      // onPress={this._onPress.bind(this, item, index)}
      >
        <View>
          <Text>{moment(checkInTime).format('L')}</Text>
          <Text>{moment(checkOutTime).format('L')}</Text>
        </View>
        <View style={{ height: 1, backgroundColor: '#000', marginTop: 3 }} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(History);