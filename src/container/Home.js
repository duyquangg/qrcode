import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

class ScanScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheckCam: false,
      typeCam: false,
    }
  }
  onSuccess = e => {
    Linking.openURL(e.data).catch(err =>
      console.error('An error occured', err)
    );
  };

  render() {
    let { isCheckCam, typeCam } = this.state;
    return (
      <QRCodeScanner
        reactivate={true}
        onRead={this.onSuccess}
        reactivateTimeout={1500}
        cameraTimeout={3000}
        cameraType={typeCam && typeCam ? 'front' : 'back'}
        containerStyle={{ backgroundColor: 'pink' }}
        flashMode={isCheckCam && isCheckCam ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        topContent={
          <Text style={styles.centerText}>
            Go to{' '}
            <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
            your computer and scan the QR code.
          </Text>
        }
        bottomContent={
          <View>
            <TouchableOpacity onPress={() => this.setState({ isCheckCam: !this.state.isCheckCam })}
              style={styles.buttonTouchable}
            >
              <Text style={styles.buttonText}>{this.state.isCheckCam ? 'Turn off' : 'Turn on'} </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ typeCam: !this.state.typeCam })}
              style={styles.buttonTouchable}
            >
              <Text style={styles.buttonText}>{this.state.typeCam ? 'Cam back' : 'Cam front'} </Text>
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
export default ScanScreen;