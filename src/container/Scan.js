import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View,
  Alert
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Firebase from '../components/firebase/FirebaseConfig';
import gui from '../lib/gui';

import * as globalActions from '../reducers/global/globalActions';


class Scan extends Component {
  constructor(props) {
    super(props);
    // [{"name":"John", "age":30},{"name":"Quang", "age":20}]
    this.state = {
      isCheckCam: false,
      typeCam: false,
      typeScan: props.global.typeScan,
    }
    const { currentUser } = Firebase.auth();
    console.log('====> current',currentUser)
  }
  componentDidMount(){
    
  }
  onSuccess = e => {
    // let data = JSON.parse(e.data)
    // data.forEach(e => {
    //   if(e.age == 10){
    //     alert('yeahhhh');
    //   } else alert('chiuuuu')
    // })
    Linking.openURL(e.data).catch(err =>
      console.error('An error occured', err)
    );
  };

  render() {
    let { isCheckCam, typeCam, typeScan } = this.state;
    console.log('====> typeScan',typeScan);
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
              <Text>asdasdsd</Text>
            </TouchableOpacity>
          </View>
          // <Text style={styles.centerText}>
          //   Go to{' '}
          //   <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
          //   your computer and scan the QR code.
          // </Text>
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