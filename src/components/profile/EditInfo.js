import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
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
import gui from '../../lib/gui';
import cfg from '../../../cfg';
import moment from 'moment';
import userApi from '../../lib/userApi';

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
    let { fullName, email, gender, phone, birthDate, avatar } = this.props.data;
    this.state = {
      fullName: fullName,
      email: email,
      phone: phone ? phone : null,
      avatar: avatar ? avatar : null,
      gender: gender ? gender : 'male',

      // birthDate: birthDate ? birthDate : new Date().getTime(),
      birthDate: birthDate ? birthDate : null,
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
        {this._renderFooter()}
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
  _renderFooter() {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.viewButton}
          onPress={this.onSave.bind(this)}
        >
          <Text style={styles.footerText}>Lưu</Text>
        </TouchableOpacity>
      </View>
    )
  }
  _renderHeader() {
    return (
      <CommonHeader
        title={"Sửa thông tin"}
        leftContent={<FontAwesome name={'chevron-left'} color={'#fff'} size={20} />}
        onPressLeft={() => Actions.pop()}
      />
    );
  }
  onSave = () => {
    let { fullName, phone, avatar, gender, birthDate } = this.state;
    console.log('====> birthDate',birthDate);
    if (!fullName) {
      this.refs.toastTop.show("Tên không được để trống!");
      return;
    }
    if (phone && phone.length !== 10) {
      this.refs.toastTop.show("Số điện thoại không đúng định dạng!");
      return;
    };
    this.setState({ loading: true });
    let dto = {
      id: this.props.global.currentUser.userID, 
      fullName, 
      phone, 
      avatar,
      gender, 
      birthDate: birthDate
    }
    userApi.updateByID(dto)
      .then(e => {
        if (e.status == 200) {
          Alert.alert("Thông báo", "Sửa đổi thông tin thành công!");
          this.setState({ loading: false }, () => {
            let dto = {
              userID: this.props.global.currentUser.userID
            }
            userApi.getByID(dto).then(e => {
              // console.log('===> updated e', e);
              if (e.status == 200) {
                Actions.pop();
                this.props.doRefresh && this.props.doRefresh(); //refresh data
              }
            })
          });
        }
      })
      .catch(e => {
        Alert.alert('Thông báo', 'Hệ thống đang lỗi, vui lòng thử lại sau!');
        this.setState({ loading: false });
      })
  };
  _renderBody() {
    let AvaUser = require('../../assets/images/user.png');
    let edit = require('../../assets/images/edit.png');
    let oval = require('../../assets/images/oval-copy.png');
    let ovalNone = require('../../assets/images/ovalNone.png');
    let { gender } = this.state;
    let _renderGender = (type, title) => {
      return (
        <TouchableOpacity
          style={styles.viewChooseSex}
          onPress={() => {
            this.setState({ gender: type });
          }}
        >
          {gender == type
            ? <Image source={oval} />
            : <Image source={ovalNone} />}
          <Text style={styles.sexText}>{title}</Text>
        </TouchableOpacity>
      )
    }
    return (
      <ScrollView style={{ flex: 1, marginBottom: 70 }}>
        <TouchableOpacity
          style={styles.viewAvatar}
          onPress={this.selectPhotoTapped.bind(this)}
        >
          <View style={styles.avatar}>
            {this.state.avatar == null
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
          {_renderGender('male', 'Nam')}
          {_renderGender('female', 'Nữ')}
          <View />
        </View>
        {this._renderBirthDay()}
      </ScrollView>
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
    const { showDate, birthDate } = this.state;
    let calendar = require('../../assets/images/calendar.png');
    return (
      <View style={styles.viewInput}>
        <Text style={styles.labelTextInput}>Ngày sinh</Text>
        <TouchableOpacity
          style={styles.viewChooseBOD}
          onPress={this.datepicker.bind(this)}
        >
          <Text style={styles.titleTextBody}>{moment(birthDate).format('DD-MM-YYYY')}</Text>
          <Image source={calendar} />
        </TouchableOpacity>
          <DateTimePickerModal
            headerTextIOS={'Chọn ngày sinh'}
            confirmTextIOS={'Lưu'}
            locale="vn-VN" // Use "en_GB" here
            isDarkModeEnabled
            cancelTextIOS={'Huỷ'}
            isVisible={showDate}
            mode="date"
            onConfirm={this.setDate.bind(this)}
            onCancel={() => this.setState({ showDate: false })}
          />
      </View>
    );
  }
  setDate = (valueDate) => {
    if(valueDate > new Date().getTime()){
      this.refs.toastTop.show('Không được chọn lớn hơn ngày hiện tại!');
      return;
    }
    this.setState({
      birthDate: valueDate,
      showDate: false
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
  footer: {
    height: 68,
    width: gui.screenWidth,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    paddingTop: 8,
    backgroundColor: '#fff'
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewButton: {
    height: 48,
    width: gui.screenWidth - 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34626c'
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(EditInfo);
