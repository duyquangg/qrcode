import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loader from '../icons/Loader';
import CommonHeader from '../header/CommonHeader';
import gui from '../../lib/gui';
import userApi from '../../lib/userApi';
import * as globalActions from '../../reducers/global/globalActions';
import { Actions } from 'react-native-router-flux';

class CheckOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheckCam: false,
      typeCam: false,


      dataUser: props.global.currentUser,

      dataTimeCheck: {},
      idCheckin: null,
      dataCheck: props.dataCheck
    };
  }
  componentDidMount = async () => {

    // // console.log('====> testId', testId);
    // let dtoUpdate = {
    //   id: testId,
    //   checkOutTime: Date.now(),
    // }
    // let resTimeUpdate = await userApi.timeUpdateByID(dtoUpdate);
    // // console.log('===> resTimeUpdate', resTimeUpdate);

  }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }
  onSuccess = async (e) => {
    let { dataCheck } = this.state;
    let id = dataCheck.id;
    if (e.data == 'CHECKIN AT PTIT') {
      Alert.alert('Thông báo','Checkout thành công!');
      let dtoUpdated = {
        id,
        checkOutTime: Date.now(),
      }
      await userApi.timeUpdateByID(dtoUpdated).then(e => {
        console.log('====> Updated Checkout', e);
      })
        .catch((e) => Alert.alert('Thông báo', 'Mã QR không hợp lệ!'))
    } else {
      Alert.alert('Mã quét được', `${e.data}`);
    }
  };

  render() {
    let { isCheckCam, typeCam } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {this._renderHeader()}
        <QRCodeScanner
          reactivate={true}
          onRead={this.onSuccess}
          reactivateTimeout={3000}
          cameraTimeout={1000}
          cameraType={typeCam && typeCam ? 'front' : 'back'}
          containerStyle={{ backgroundColor: '#fff' }}
          flashMode={isCheckCam && isCheckCam ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
          // topContent={
          //   <View style={{ marginTop: Platform.OS === 'ios' ? ((height === 812 || width === 812 || height === 896 || width === 896) ? 30 : 10) : 10 }}>
          //       <Text style={styles.centerText}>Checkin</Text>
          //   </View>
          // }
          bottomContent={
            <View>
              <TouchableOpacity disabled={this.state.typeCam} onPress={() => this.setState({ isCheckCam: !this.state.isCheckCam })}
                style={styles.buttonTouchable}
              >
                <Text style={styles.buttonText}>{this.state.isCheckCam ? 'Turn off' : 'Turn on'} </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ typeCam: !this.state.typeCam })}
                style={styles.buttonTouchable}
              >
                <Text style={styles.buttonText}>{this.state.typeCam ? 'Back camera' : 'Front camera'} </Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
  }
  _renderHeader = () => {
    return (
      <CommonHeader
        title={"Checkout"}
        leftContent={<FontAwesome name={'chevron-left'} color={'#fff'} size={20} />}
        onPressLeft={() => {
          Actions.pop();
          this.props.doRefresh && this.props.doRefresh();
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#000'
  },
  textBold: {
    fontWeight: 'bold',
    color: '#fff'
  },
  buttonText: {
    fontSize: 21,
    color: gui.mainColor
  },
  buttonTouchable: {
    padding: 16
  },
  viewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
export default connect(mapStateToProps, mapDispatchToProps)(CheckOut);