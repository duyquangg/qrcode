import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
      dataCheck: {}
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = async () => {
    // this.setState({ loading: true })
    let dto = {
      userID: this.props.global.currentUser.userID
    };
    let resGetTimeByUser = await userApi.timeGetByUserID(dto);
    if (resGetTimeByUser.status == 200) {
      let data = resGetTimeByUser.data[0];
      this.setState({
        dataCheck: data,
        // loading: false
      })
    }
  }
  render() {
    let { dataCheck } = this.state;
    console.log('====> dataCheck', dataCheck);
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
    return (
      <View>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={false}
            // onRefresh={this._onRefresh.bind(this)}
            />
          }
          style={{ backgroundColor: '#fff', flex: 1 }}
          contentContainerStyle={{ paddingTop: 10, marginBottom: 10 }}
          // data={limitItem ? dataList.slice(0, 2) : dataList}
          renderItem={({ item, index }) => {
            return (
              // <FlatListItem item={item} index={index}
              //   token={user.token}
              //   isOneTimeFeeNotify={user.isOneTimeFeeNotify}
              //   language={home.language}
              //   doRefreshData={this._onRefresh.bind(this)}
              //   numberOfLines={limitItem}
              //   countAlert={home.countAlert}
              //   setFileLoading={this._setFileLoading.bind(this)}
              // />
              <View>
                <Text>aasdasd</Text>
              </View>
            );
          }}
          keyExtractor={(item, index) => item.id}
          // ListFooterComponent={limitItem ? null : this.ListFooterComponent()}
          removeClippedSubviews={false}
          enableEmptySections
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={10}
          initialListSize={20}
          onEndReachedThreshold={0}
        // onEndReached={debounce(this.onEndReached.bind(this), 300)}
        />
        <TouchableOpacity
          style={styles.viewSubmit}>
          <Text style={styles.textSubmit}>Cập nhật</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewSubmit: {
    marginLeft: 16,
    marginRight: 16,
    height: 48,
    marginTop: 40,
    borderRadius: 8,
    backgroundColor: '#34626c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSubmit: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(History);