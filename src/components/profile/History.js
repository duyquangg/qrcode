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
import Modal from "react-native-modalbox";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Toast from "../toast/Toast";
import CommonHeader from '../header/CommonHeader';
import gui from '../../lib/gui';
import userApi from '../../lib/userApi';
import utils from '../../lib/utils';
import Loader from '../icons/Loader';

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
      loading: false,
      showModal: false,

      valueDate1: new Date().getTime(),
      valueDate2: new Date().getTime(),
      showDate1: false,
      showDate2: false,
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
    console.log('====> resGetHistory', resGetHistory);
    if (resGetHistory.status == 200) {
      let data = resGetHistory.data;
      this.setState({ dataUser: data });
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this._renderHeader()}
        {this._renderBody()}
        {this._renderModal()}
        <Loader loading={this.state.loading} />
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
        rightContent={<FontAwesome name={'filter'} color={'#fff'} size={20} />}
        onPressRight={() => this.setState({ showModal: true })}
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
        // ListFooterComponent={this.ListFooterComponent()}
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

  // ListFooterComponent = () => {
  //   let showReadMoreJSX = (
  //     <TouchableOpacity
  //       style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}
  //     >
  //       {/* <PacmanIndicator color={gui.mainColor} /> */}
  //       <Text>ahihi</Text>
  //     </TouchableOpacity>
  //   );
  //   if (this.state.loading === true) {
  //     return (
  //       <View>
  //         {showReadMoreJSX}
  //       </View>
  //     );
  //   }
  // };
  _renderModal = () => {
    let { showModal } = this.state;
    return (
      <Modal
        style={{
          height: "auto",
          width: gui.screenWidth - 16,
          borderRadius: 10,
        }}
        position={"center"}
        isOpen={showModal}
        swipeToClose={true}
        backdropPressToClose={true}
        onClosed={() => {
          this.setState({ showModal: false });
        }}
      >
        <View style={{ height: "auto" }}>
          <View style={styles.viewHeaderModal}>
            <View />
            <Text style={styles.textHeaderModal}>Lọc</Text>
            <TouchableOpacity onPress={this.onFilter.bind(this)}>
              <Text style={styles.textNormalModal}>Xong</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewLineModal} />
          {/* <Text style={styles.titleModal}>TRẠNG THÁI</Text> */}
          {/* <Text style={styles.titleModal}>THỜI GIAN</Text> */}
          <Text style={styles.labelText}>Từ ngày</Text>
          {this._renderFrom()}
          <Text style={[styles.labelText, { marginTop: -10 }]}>Đến ngày</Text>
          {this._renderTo()}
        </View>
      </Modal>
    );
  };
  _renderFrom() {
    const { showDate1, valueDate1 } = this.state;
    let calendar = require('../../assets/images/calendar.png');
    return (
      <View style={styles.viewChooseDate}>
        <TouchableOpacity
          style={styles.viewChooseBOD}
          onPress={this.datepicker1.bind(this)}
        >
          <Text style={styles.titleTextBody}>{moment(valueDate1).format('DD/MM/YYYY')}</Text>
          <Image source={calendar} />
        </TouchableOpacity>
        <DateTimePickerModal
          headerTextIOS={'Chọn ngày'}
          confirmTextIOS={'Lưu'}
          isDarkModeEnabled
          locale="vn-VN" // Use "en_GB" here
          cancelTextIOS={'Huỷ'}
          isVisible={showDate1}
          mode="date"
          onConfirm={this.setDate1.bind(this)}
          onCancel={() => this.setState({ showDate1: false })}
        />
      </View>
    );
  }
  setDate1 = (valueDate) => {
    // let checkDate = moment(valueDate).format("DD/MM/YYYY");
    // let now = moment(Date.now()).format('DD/MM/YYYY');
    // if (checkDate < now) {
    //   this.refs.toastTop.show('Không được chọn nhỏ hơn ngày hiện tại!');
    //   return;
    // };
    this.setState({
      // valueDate1: checkDate ? valueDate : valueDate,
      valueDate1: valueDate,
      showDate1: false
    });
  };

  datepicker1 = () => {
    this.setState({ showDate1: true })
  };
  _renderTo() {
    const { showDate2, valueDate2 } = this.state;
    let calendar = require('../../assets/images/calendar.png');
    return (
      <View style={styles.viewChooseDate}>
        <TouchableOpacity
          style={styles.viewChooseBOD}
          onPress={this.datepicker2.bind(this)}
        >
          <Text style={styles.titleTextBody}>{moment(valueDate2).format('DD/MM/YYYY')}</Text>
          <Image source={calendar} />
        </TouchableOpacity>
        <DateTimePickerModal
          headerTextIOS={'Chọn ngày'}
          confirmTextIOS={'Lưu'}
          locale="vn-VN" // Use "en_GB" here
          isDarkModeEnabled
          cancelTextIOS={'Huỷ'}
          isVisible={showDate2}
          mode="date"
          onConfirm={this.setDate2.bind(this)}
          onCancel={() => this.setState({ showDate2: false })}
        />
      </View>
    );
  }
  setDate2 = (valueDate) => {
    // let checkDate = moment(valueDate).format("DD/MM/YYYY");
    console.log('====> valueDate', valueDate);
    console.log('====> this.state.valueDate1', this.state.valueDate1);
    if (valueDate < this.state.valueDate1) {
      this.refs.toastTop.show('Không được chọn ngày nhỏ hơn ngày bắt đầu!');
      return;
    }
    this.setState({
      // valueDate2: checkDate ? valueDate : valueDate,
      valueDate2: valueDate,
      showDate2: false
    });
  };

  datepicker2 = () => {
    this.setState({ showDate2: true })
  };
  onFilter = () => {
    let { valueDate1, valueDate2 } = this.state;

    // time start date
    let a = new Date(valueDate1);
    var year1 = a.getUTCFullYear();
    var month1 = a.getUTCMonth();
    var day1 = a.getUTCDate();
    var startHour1 = Date.UTC(year1, month1, day1, 0, 0, 0, 0); //onDate di muon

    //time end date
    let b = new Date(valueDate2);
    var year2 = b.getUTCFullYear();
    var month2 = b.getUTCMonth();
    var day2 = b.getUTCDate();
    var startHour2 = Date.UTC(year2, month2, day2, 0, 0, 0, 0);
    var endHour2 = startHour2 + 86400000 - 1;

    if (valueDate2 < valueDate1) {
      return this.refs.toastTop.show('Không được chọn ngày nhỏ hơn ngày bắt đầu!');
    }

    this.setState({ loading: true });
    let dtoCreate = {
      role: this.props.global.currentUser.role,
      fromDate: startHour1,
      toDate: endHour2,
    };
    userApi.search(dtoCreate)
      .then(e => {
        console.log('====> search', e);
        this.setState({
          loading: false,
          showModal: false,
          dataUser: e
        }
          // , () => {
          //   this.fetchData.bind(this)
          // }
        );
      });
  }
}
class FlatListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    let { item, index, doRefreshData } = this.props;
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
  },
  //filter
  viewHeaderModal: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 15
  },
  textHeaderModal: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  textNormalModal: {
    fontSize: 15,
    color: '#34626c',
    fontWeight: '700'
  },
  titleModal: {
    fontSize:14,
    color:'gray',
    fontWeight:'700',
    marginLeft:16,
    marginTop:16,
  },
  viewLineModal: {
    height: 1,
    backgroundColor: '#34626c',
    marginTop: 5,
  },
  viewChooseDate: {
    marginHorizontal: 16,
    height: 40,
    borderColor: '#34626c',
  },
  viewChooseBOD: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
    justifyContent: 'space-between',
  },
  labelText: {
    fontSize: 12,
    color: '#627792',
    marginLeft: 16,
    marginTop: 10,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(History);