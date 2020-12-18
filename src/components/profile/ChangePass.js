import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Toast from "../toast/Toast";
import CommonHeader from '../header/CommonHeader';
import gui from '../../lib/gui';
import ls from '../../lib/localStorage';
import Firebase, { db } from '../firebase/FirebaseConfig';

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
      old: null,
      email: null,
      oldPass: '',
      newPass: '',
      reNewPass: '',
      oldPassHidden: true,
      newPassHidden: true,
      reNewPassHidden: true,
    };
  }
  componentDidMount() {
    ls.getLoginInfo().then(ls => {
      this.setState({ old: ls.password, email: ls.email });
    });
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
        title={"Đổi mật khẩu"}
        leftContent={<FontAwesome name={'chevron-left'} color={'#fff'} size={20} />}
        onPressLeft={() => Actions.pop()}
      />
    );
  }
  _renderBody() {
    let eye = require('../../assets/images/eye.png');
    let eyeHidden = require('../../assets/images/eyeNone.png');
    return (
      <View>
        <View>
          <View style={styles.viewInput}>
            <Text style={styles.labelTextInput}>Mật khẩu cũ</Text>
            <TextInput
              style={styles.viewTextInput}
              placeholder={'Nhập mật khẩu cũ'}
              secureTextEntry={this.state.oldPassHidden}
              padding={10}
              autoCapitalize="none"
              onChangeText={text => {
                this.setState({ oldPass: text });
              }}
              value={this.state.oldPass}
            />
          </View>
          <TouchableOpacity
            style={styles.viewEyeImage}
            onPress={this.onShowOldPass.bind(this)}
          >
            {this.state.oldPassHidden
              ? <Image source={eyeHidden} />
              : <Image source={eye} />}
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.viewInput}>
            <Text style={styles.labelTextInput}>Mật khẩu mới</Text>
            <TextInput
              style={styles.viewTextInput}
              placeholder={'Nhập mật khẩu mới'}
              secureTextEntry={this.state.newPassHidden}
              padding={10}
              autoCapitalize="none"
              onChangeText={text => {
                this.setState({ newPass: text });
              }}
              value={this.state.newPass}
            />
          </View>
          <TouchableOpacity
            style={styles.viewEyeImage}
            onPress={this.onShowNewPass.bind(this)}
          >
            {this.state.newPassHidden
              ? <Image source={eyeHidden} />
              : <Image source={eye} />}
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.viewInput}>
            <Text style={styles.labelTextInput}>Nhập lại mật khẩu</Text>
            <TextInput
              style={styles.viewTextInput}
              placeholder={'Nhập mật khẩu mới'}
              secureTextEntry={this.state.reNewPassHidden}
              padding={10}
              autoCapitalize="none"
              onChangeText={text => {
                this.setState({ reNewPass: text });
              }}
              value={this.state.reNewPass}
            />
          </View>
          <TouchableOpacity
            style={styles.viewEyeImage}
            onPress={this.onShowReNewPass.bind(this)}
          >
            {this.state.reNewPassHidden
              ? <Image source={eyeHidden} />
              : <Image source={eye} />}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={this.onPressChangePass.bind(this)}
          style={styles.viewSubmit}>
          <Text style={styles.textSubmit}>Cập nhật</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onPressChangePass = async () => {
    let { oldPass, newPass, reNewPass, old, email } = this.state;
    if (oldPass.length < 1) {
      this.refs.toastTop.show("Bạn cần điền mật khẩu cũ!");
      return;
    }
    if (newPass.length < 1) {
      this.refs.toastTop.show("Bạn cần điền mật khẩu mới!");
      return;
    }
    if (reNewPass.length < 1) {
      this.refs.toastTop.show("Bạn cần điền lại mật khẩu mới!");
      return;
    }
    if (reNewPass.length < 6 || newPass.length < 6) {
      this.refs.toastTop.show("Mật khẩu mới cần ít nhất 6 ký tự!");
      return;
    }
    if (reNewPass !== newPass) {
      this.refs.toastTop.show("Mật khẩu mới không trùng khớp!");
      return;
    }
    if (old !== oldPass) {
      this.refs.toastTop.show("Mật khẩu cũ không đúng rồi!");
      return;
    }
    if (old == newPass) {
      this.refs.toastTop.show("Mật khẩu mới không được trùng mật khẩu cũ nhá!");
      return;
    }

    let dto = {
      email,
      password: newPass
    };
    ls.setLoginInfo(dto);
    this.refs.toastTop.show('Đổi mật khẩu thành công!');
      setTimeout(() => Actions.pop(), 1000);


    // let resChangePass = await userApi.changePassword(dto, token);
    // if(resChangePass.status === 200) {
    //   this.refs.toastTop.show('Đổi mật khẩu thành công!');
    //   await ls.removeLogin();
    //   setTimeout(() => Actions.LoginScreen(), 1000)
    // } else {
    //   this.refs.toastTop.show(resChangePass.msg);
    // }
  }

  onShowOldPass() {
    this.setState({
      oldPassHidden: !this.state.oldPassHidden,
    });
  }
  onShowNewPass() {
    this.setState({
      newPassHidden: !this.state.newPassHidden,
    });
  }
  onShowReNewPass() {
    this.setState({
      reNewPassHidden: !this.state.reNewPassHidden,
    });
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 55 : 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
  },
  titleTextHeader: {
    fontSize: 18,
    color: '#0e2b5c',
    fontWeight: '800',
  },
  viewInput: {
    height: 48,
    marginLeft: 16,
    marginTop: 16,
    width: gui.screenWidth - 32,
    backgroundColor: '#f7f7f9',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#e8e9f0',
  },
  labelTextInput: {
    fontSize: 10,
    color: '#627792',
    marginTop: 3,
    zIndex: 1,
    marginLeft: 10,
  },
  viewTextInput: {
    height: 40,
    width: 200,
    backgroundColor: '#f7f7f9',
    fontSize: 16,
    position: 'absolute',
    top: 10,
    fontWeight: '600',
    left: 0,
    color: gui.colorText,
  },
  viewEyeImage: {
    bottom: 35,
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 30,
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