import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View,
  Alert,
  ActivityIndicator
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { db } from '../components/firebase/FirebaseConfig';

import Loader from '../components/icons/Loader';
import gui from '../lib/gui';
import ls from '../lib/localStorage';
import * as globalActions from '../reducers/global/globalActions';


class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheckCam: false,
      typeCam: false,
      allData: [],
      email: null,
      fullName: '',
      dataEmail: [],
    }
  }
  componentDidMount() {
    db.collection('users')
      .get()
      .then(snapshot => {
        let users = [];
        let dataEmail = [];
        snapshot.forEach(e => {
          let data = e.data();
          users.push(data);
          dataEmail.push(data.email);
        });
        ls.getLoginInfo().then(ls => {
          let email = ls.email;
          let fullName = null;
          users.forEach(e => {
            if (e.email == email) {
              return fullName = e.fullName;
            }
            return;
          });
          this.setState({ email: ls.email, allData: users, fullName, dataEmail });
        });
      })
      .catch(error => console.log(error))
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("Data" + nextProps.payload.payloadData); // Display [Object Object]
    console.log(nextProps.payload.payloadData);  //  Display proper list
  }
  onSuccess = e => {
    // checkin at PTIT
    // let data = JSON.parse(e.data) // [{"name":"John", "age":30},{"name":"Quang", "age":20}]
    // alert(JSON.stringify(e));

    // if (e.data == 'checkin at PTIT') {
    //   return alert('hihi')
    // } else
    Linking.openURL(e.data).catch(err =>
      console.error('An error occured', err)
    );
  };

  render() {
    let { isCheckCam, typeCam, allData, email, fullName, dataEmail } = this.state;
    console.log('=====> dataEmail', dataEmail);
    if (!allData) {
      return <Loader />
    }
    return (
      <QRCodeScanner
        reactivate={true}
        onRead={this.onSuccess}
        reactivateTimeout={1500}
        cameraTimeout={3000}
        cameraType={typeCam && typeCam ? 'front' : 'back'}
        containerStyle={{ backgroundColor: '#d0e8f2' }}
        flashMode={isCheckCam && isCheckCam ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        topContent={
          <View>
            <TouchableOpacity>
              <Text style={styles.centerText}>Xin chào{' '}
                <Text style={styles.textBold}>{fullName} !</Text>
              </Text>
            </TouchableOpacity>
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
              <Text style={styles.buttonText}>{this.state.typeCam ? 'Front camera' : 'Back camera'} </Text>
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
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
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