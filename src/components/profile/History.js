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
    console.log('===> resGetHistory',resGetHistory.data)
    if (resGetHistory.status == 200) {
      let data = resGetHistory.data;
      this.setState({ dataUser: data })
    }
  }
  render() {
    let { dataUser } = this.state;
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
    let {dataUser } = this.state;
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
    console.log('===> item', item);
    return (
      <View
        key={item.id}
        activeOpacity={1}
      // onPress={this._onPress.bind(this, item, index)}
      >
        <View>
          <Text>{item.fullName}</Text>
          <Text>{moment(item.checkInTime).format('LLLL')}</Text>
          <Text>{moment(item.checkOutTime).format('LLLL')}</Text>
        </View>
        <View style={{ height: 1, backgroundColor: 'gray', marginTop: 3 }} />
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