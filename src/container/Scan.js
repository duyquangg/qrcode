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

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import moment from 'moment';

import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Firebase, { db } from '../components/firebase/FirebaseConfig';

import Loader from '../components/icons/Loader';
import gui from '../lib/gui';
import ls from '../lib/localStorage';
import userApi from '../lib/userApi';
import * as globalActions from '../reducers/global/globalActions';

class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheckCam: false,
      typeCam: false,
      allData: [],
      dataEmail: [],


      dataUser: this.props.global.currentUser,

      dataTime: {},
    };
  }
  componentDidMount = async () => {
    let dto = {
      userID: this.props.global.currentUser.userID
    };
    let resGetTimeByUser = await userApi.timeGetByUserID(dto);
    console.log('====> resGetTimeByUser',resGetTimeByUser);

    let dtoCreate = {
      checkInTime: 1608260870,
      // checkOutTime: 1608260878,
      userID: this.props.global.currentUser.userID,
    }
    let resTimeCreate = await userApi.timeCreate(dtoCreate);
    console.log('===> resTimeCreate',resTimeCreate);

    let dtoUpdate = {
      id: this.props.global.currentUser.userID,
      checkOutTime: 1608260870,
    }
    let resTimeUpdate = await userApi.timeUpdateByID(dtoUpdate);
    console.log('===> resTimeUpdate',resTimeUpdate);
    
    // db.collection('users')
    //   .get()
    //   .then(snapshot => {
    //     let users = [];
    //     let dataEmail = [];
    //     snapshot.forEach(e => {
    //       let data = e.data();
    //       users.push(data);
    //       dataEmail.push(data.email);
    //     });
    //     ls.getLoginInfo().then(ls => {
    //       let email = ls.email;
    //       let fullName = null;
    //       users.forEach(e => {
    //         if (e.email == email) {
    //           return fullName = e.fullName;
    //         }
    //         return;
    //       });
    //       this.setState({ email: ls.email, allData: users, fullName, dataEmail });
    //     });
    //   })
    //   .catch(error => console.log(error));
    // // checkInTime
    // await Firebase.auth().onAuthStateChanged((user) => {
    //   db.collection('users')
    //     .doc(`${user.uid}`)
    //     .get()
    //     .then((e) => {
    //       // console.log('====> dataTime',e.data().history)
    //       e.data().checkIn ? this.setState({ checkInTime: e.data().checkIn })
    //         : this.setState({ checkInTime: null })
    //     })
    // })
  }
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   console.log("Data" + nextProps.payload.payloadData); // Display [Object Object]
  //   console.log(nextProps.payload.payloadData);  //  Display proper list
  // }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }
  onSuccess = (e) => {
    // checkin at PTIT
    // let data = JSON.parse(e.data) // [{"name":"John", "age":30},{"name":"Quang", "age":20}]
    // alert(JSON.stringify(e));

    let { email, dataEmail, checkInTime } = this.state;
    // console.log('====> checkInTime',checkInTime);
    if (e.data == 'checkin at PTIT') {
      // let check = dataEmail.includes(email);
      // check ? Alert.alert('Thông báo', 'Quét mã QR thành công !') : Alert.alert('Thông báo', 'Quét mã QR thất bại !');
      // let currentUser = Firebase.auth().currentUser;
      // let userId = currentUser.uid;
      //   if (checkInTime != null || checkInTime != undefined) {
      //     let dataHistory = [];
      //     dataHistory.push({
      //       checkOut: Date.now(),
      //       checkIn: checkInTime,
      //     });
      //     db.collection('users')  //insert
      //       .doc(`${userId}`)
      //       .add({
      //         checkOut: Date.now(),
      //         history: dataHistory,
      //       })
      //       .then((userId) => {
      //         // console.log('====> checkOut successfull!');
      //       })
      //     db.collection('users') //get data user
      //       .doc(`${userId}`)
      //       .get()
      //       .then((e) => {
      //         this.setState({ checkOutTime: e.data().checkOut });
      //         let formartTime = moment(e.data().checkOut).format('LT' + ' - ' + 'DD/MM/YYYY');
      //         this.props.actions.onGlobalFieldChange('checkOut', formartTime);
      //         // console.log('====> checkOut', e.data())
      //       })
      //   } else {
      //     //update checkInTime
      //     db.collection('users') //ínert nếu k có checkOut
      //       .doc(`${userId}`)
      //       .add({
      //         checkIn: Date.now(),
      //         history: [{
      //           checkIn: Date.now(),
      //         }]
      //       })
      //       .then((userId) => {
      //         // console.log('====> hhhh',userId);
      //       })
      //       .catch((error) => console.log(error));

      //     db.collection('users')  //save to state
      //       .doc(`${userId}`)
      //       .get()
      //       .then((e) => {
      //         this.setState({ checkInTime: e.data().checkIn });
      //         let formartTime = moment(e.data().checkIn).format('LT' + ' - ' + 'DD/MM/YYYY');
      //         this.props.actions.onGlobalFieldChange('checkIn', formartTime);
      //       })
      //       .catch((error) => console.log(error));
      //   }
      // } else {
      //   Alert.alert('Thông báo', 'Mã QR không quét được !')
    }
  };

  render() {
    let { isCheckCam, typeCam, allData, dataUser, checkInTime, checkOutTime } = this.state;
    let { currentUser } = this.props.global;
    // console.log('====> dataUser',dataUser);
    if (!allData) {
      return <Loader />
    }
    return (
      <QRCodeScanner
        reactivate={true}
        onRead={this.onSuccess}
        reactivateTimeout={3000}
        cameraTimeout={1000}
        cameraType={typeCam && typeCam ? 'front' : 'back'}
        containerStyle={{ backgroundColor: '#839b97' }}
        flashMode={isCheckCam && isCheckCam ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        topContent={
          <View style={{ marginTop: Platform.OS === 'ios' ? ((height === 812 || width === 812 || height === 896 || width === 896) ? 30 : 10) : 10 }}>
            <Text style={styles.centerText}>Xin chào{' '}
              {this.props.global.currentUser.fullName ? <Text style={styles.textBold}>{this.props.global.currentUser.fullName} !</Text> : null}
            </Text>
            <Text>{moment(checkInTime).format('LT' + ' - ' + 'DD/MM/YYYY')}</Text>
            <Text>{moment(checkOutTime).format('LT' + ' - ' + 'DD/MM/YYYY')}</Text>
          </View>
        }
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
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#e8e8e8'
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
export default connect(mapStateToProps, mapDispatchToProps)(Scan);