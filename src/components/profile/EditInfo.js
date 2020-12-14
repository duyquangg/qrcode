import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Loader from '../icons/Loader';
import CommonHeader from '../header/CommonHeader';
import Toast from "../toast/Toast";
import ls from '../../lib/localStorage';
import Firebase, { db } from '../firebase/FirebaseConfig';
import gui from '../../lib/gui';
import cfg from '../../../cfg';
import moment from 'moment';

import * as globalActions from '../../reducers/global/globalActions';

const actions = [globalActions];
function mapStateToProps(state) {
  return {
    ...state,
  };
}
function mapDispatchToProps(dispatch) {
  const creators = Map()
    .merge(...actions)
    .filter(value => typeof value === 'function')
    .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch,
  };
}

class EditInfo extends Component {
  constructor(props) {
    super(props);
    const { fullName, email, phone, avatar, gender, birthday } = this.props.data;
    // console.log ('========currentUser', this.props.global.currentUser);
    this.state = {
      fullName: fullName,
      email: email,
      phone: phone,
      avatar: avatar ? avatar : null,
      gender: gender ? gender : 'male',

      date: moment().format("DD-MM-YYYY"),
      mode: 'date',
      showDate: false,

      loading: false,
    };
  }
  componentDidMount() {

  }
  render() {
    return (
      <View style={styles.container}>
        {this._renderHeader()}
        {this._renderBody()}
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
        title={"Sửa thông tin"}
        leftContent={<FontAwesome name={'chevron-left'} color={'#fff'} size={20} />}
        onPressLeft={() => Actions.pop()}
        rightContent={
          <Text style={styles.normalTextHeader}>Lưu</Text>
        }
        onPressRight={this.onSave.bind(this)}
      />
    );
  }
  onSave = () => {
    let { fullName, phone, avatar, gender, birthday, loading } = this.state;
    if (phone) {
      if (phone.length !== 10) {
        this.refs.toastTop.show("Số điện thoại không đúng định dạng!");
        return;
      };
      db.collection('users')
      .doc(`${userId}`)
      .update({
        fullName: fullName,
        phone: phone,
        avatar: avatar,
        gender: gender,
        // birthday: birthday,
      })
      .then((e) => {
        let dto = {
          fullName: fullName,
          phone: phone,
          avatar: avatar,
          gender: gender,
        };
        Alert.alert("Thông báo","Sửa đổi thông tin thành công!");
        this.setState({loading: false}, () => {
          Actions.pop();
          ls.setLoginInfo(dto);
          this.props.doRefresh && this.props.doRefresh(); //refresh data
        });
      })
    }
    if (!fullName) {
      this.refs.toastTop.show("Tên không được để trống!");
      return;
    }
    this.setState({loading: true})
    let currentUser = Firebase.auth().currentUser;
    let userId = currentUser.uid;
    db.collection('users')
      .doc(`${userId}`)
      .update({
        fullName: fullName,
        avatar: avatar,
        gender: gender,
        // birthday: birthday,
      })
      .then((e) => {
        let dto = {
          fullName: fullName,
          phone: phone,
          avatar: avatar,
          gender: gender,
        };
        Alert.alert("Thông báo","Sửa đổi thông tin thành công!");
        this.setState({loading: false}, () => {
          Actions.pop();
          ls.setLoginInfo(dto);
          this.props.doRefresh && this.props.doRefresh(); //refresh data
        });
      })
  }
  _renderBody() {
    let AvaUser = require('../../assets/images/user.png');
    let edit = require('../../assets/images/edit.png');
    let oval = require('../../assets/images/oval-copy.png');
    let ovalNone = require('../../assets/images/ovalNone.png');
    let { gender } = this.state;
    return (
      <View>
        <TouchableOpacity
          style={styles.viewAvatar}
          onPress={this.selectPhotoTapped.bind(this)}
        >
          <View style={styles.avatar}>
            {this.state.avatar === null
              ? <Image source={AvaUser} style={{ height: 128, width: 128 }} />
              : <Image
                source={{ uri: this.state.avatar }}
                style={[styles.avatar, { marginLeft: 0 }]}
              />}
            <Image source={edit} style={styles.viewEdit} />
          </View>
        </TouchableOpacity>
        {this._renderFullName()}
        {this._renderPhone()}
        {this._renderEmail()}
        <Text style={styles.labelText}>Giới tính</Text>
        <View style={styles.viewChoose}>
          <TouchableOpacity
            style={styles.viewChooseSex}
            onPress={() => {
              this.setState({ gender: 'male' });
            }}
          >
            {gender === 'male'
              ? <Image source={oval} />
              : <Image source={ovalNone} />}
            <Text style={styles.sexText}>Nam</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewChooseSex}
            onPress={() => {
              this.setState({ gender: 'female' });
            }}
          >
            {gender === 'female'
              ? <Image source={oval} />
              : <Image source={ovalNone} />}
            <Text style={styles.sexText}>Nữ</Text>
          </TouchableOpacity>
          <View />
        </View>
        {/* {this._renderBirthDay()} */}
      </View>
    );
  }
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      // console.log ('Response = ', response);

      if (response.didCancel) {
        // console.log ('User cancelled photo picker');
      } else if (response.error) {
        // console.log ('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log ('User tapped custom button: ', response.customButton);
      } else {
        ImageResizer.createResizedImage(
          response.uri,
          cfg.maxWidth,
          cfg.maxHeight,
          'JPEG',
          cfg.imageQuality,
          0,
          null
        )
          .then(response => {
            this.setState({
              avatar: response.uri,
            });
          })
          .catch(err => {
            log.error(err);
          });
      }
    });
  }
  _renderFullName() {
    return (
      <View style={styles.viewInput}>
        <Text style={styles.labelTextInput}>Họ & tên</Text>
        <TextInput
          onChangeText={fullName => this.setState({ fullName })}
          value={this.state.fullName}
          placeholderTextColor="#a6a9b6"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          style={styles.titleTextBody}
        />
      </View>
    );
  }
  _renderPhone() {
    return (
      <View style={styles.viewInput}>
        <Text style={styles.labelTextInput}>Số điện thoại</Text>
        <TextInput
          onChangeText={phone => this.setState({ phone })}
          value={this.state.phone}
          keyboardType={'phone-pad'}
          placeholderTextColor="#a6a9b6"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          style={styles.titleTextBody}
        />
      </View>
    );
  }
  _renderEmail() {
    return (
      <View style={[styles.viewInput, { backgroundColor: '#f7f7f9' }, { opacity: 0.7 }]}>
        <Text style={styles.labelTextInput}>Email</Text>
        <Text style={styles.titleTextBody}>{this.state.email}</Text>
      </View>
    );
  }
  _renderBirthDay() {
    const { showDate, date, mode } = this.state;
    let calendar = require('../../assets/images/calendar.png');
    return (
      <View style={styles.viewInput}>
        <Text style={styles.labelTextInput}>Ngày sinh</Text>
        <TouchableOpacity
          style={styles.viewChooseBOD}
          onPress={this.datepicker.bind(this)}
        >
          <Text style={styles.titleTextBody}>{this.state.date}</Text>
          <Image source={calendar} />
        </TouchableOpacity>
        {showDate &&
          <DateTimePickerModal
            headerTextIOS={'Chọn ngày'}
            confirmTextIOS={'Lưu'}
            locale="vn-VN" // Use "en_GB" here
            cancelTextIOS={'Huỷ'}
            isVisible={showDate}
            mode="date"
            onConfirm={this.setDate}
            onCancel={() => this.setState({ showDate: false })}
          />
        }
        {/* {showDate &&
          <DateTimePicker
            value={date}
            mode={mode}
            display='default'
            onChange={this.setDate}
          />} */}
      </View>
    );
  }
  setDate = (date) => {
    console.log('===> date', date);
    this.setState({
      date,
      showDate: false
    });
  };

  showDate = mode => {
    this.setState({
      showDate: true,
      mode,
    });
  };

  datepicker = () => {
    this.setState({ showDate: true })
  };
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
  normalTextHeader: {
    fontSize: 16,
    color: '#fff',
  },
  viewAvatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: 45,
    shadowColor: '#a6a9b6',
    shadowOpacity: 1,
    // overflow: 'hidden'
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    top: -1.5
  },
  viewEdit: {
    position: 'absolute',
    top: 45,
    left: 45,
  },
  viewInput: {
    height: 48,
    marginLeft: 16,
    marginTop: 30,
    width: gui.screenWidth - 32,
    backgroundColor: '#f7f7f9',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#e8e9f0',
  },
  titleTextBody: {
    color: '#4b515d',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 10,
  },
  labelTextInput: {
    fontSize: 10,
    color: '#627792',
    marginTop: 3,
    zIndex: 1,
    marginLeft: 10,
  },
  labelText: {
    fontSize: 10,
    color: '#627792',
    marginLeft: 16,
    marginTop: 20,
  },
  viewChoose: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  viewChooseSex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sexText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b515d',
    marginLeft: 8,
  },
  viewChooseBOD: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
    justifyContent: 'space-between',
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(EditInfo);
