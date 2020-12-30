import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import ls from '../lib/localStorage';
import gui from '../lib/gui';
import Loader from '../components/icons/Loader';

import * as globalActions from '../reducers/global/globalActions';
import userApi from '../lib/userApi';

const actions = [
  globalActions,
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
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      dataUser: props.global.currentUser,
    };
  }
  // componentDidMount = async () => {
  //   let dto = {
  //     userID: this.props.global.currentUser.userID
  //   }
  //   let resApi = await userApi.getByID(dto);
  //   if (resApi.status == 200) {
  //     this.setState({ data: resApi.data });
  //   }
  // }
  
  // componentDidUpdate(prevProps, prevState) {
  //   console.log('===> prevState componentDidUpdate', prevState)
  //   console.log('===> prevProps componentDidUpdate', prevProps.global.currentUser.fullName)
  // }
  render() {
    let AvaUser = require('../assets/images/user.png');
    let { email, avatar } = this.state.dataUser;
    if (!this.state.dataUser) {
      return <Loader />
    }
    return (
      <View style={styles.container}>
        {/* <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}> */}
        <LinearGradient
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 0 }}
          colors={gui.linearMain}
          style={styles.viewLinear}
        >
          <View style={styles.viewAvatar}>
            <View style={styles.avatar}>
              {avatar == null
                ? <Image source={AvaUser} style={{ height: 120, width: 120 }} />
                : <Image
                  source={{ uri: avatar }}
                  style={[styles.avatar, { marginLeft: 0 }]}
                />}
            </View>
          </View>
          <Text style={styles.textTitle}>{email}</Text>
          {/* <Text style={styles.textPhone}>{phone}</Text> */}
          <View style={styles.viewBody}>
            {this._renderBody('history', 'Lịch sử', () => Actions.History())}
            {this._renderBody('edit', 'Sửa thông tin', () => Actions.EditInfo({ data: this.state.dataUser, doRefresh: this.fetchData.bind(this) }))}
          </View>
          <TouchableOpacity style={styles.viewLogout}
            onPress={this.onActionsPress.bind(this)}>
            <View style={styles.viewRowLogout}>
              <FontAwesome name={"sign-out"} color={'#fff'} size={20} style={{ opacity: 0.9 }} />
              <Text style={styles.textLogout}>Đăng xuất</Text>
            </View>
            <FontAwesome name={"chevron-right"} color={'#fff'} size={18} style={{ marginRight: 12, opacity: 0.8 }} />
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.textFooter}>Phiên bản</Text>
            <Text style={[styles.textFooter, { fontSize: 14 }]}>1.0.1</Text>
          </View>
        </LinearGradient>
        {/* </ScrollView> */}
      </View>
    );
  }
  _renderBody = (source, text, onPress) => {
    return (
      <TouchableOpacity style={styles.viewRowBody} onPress={onPress}>
        <FontAwesome name={source} color={'#fff'} size={26} />
        <Text style={styles.normalTextBody}>{text}</Text>
      </TouchableOpacity>
    );
  };
  onActionsPress() {
    Alert.alert('Thông báo', 'Bạn có chắc chắn muốn đăng xuất?', [
      {
        text: 'Huỷ',
        onPress: () => console.info('Cancel Pressed'),
      },
      {
        text: 'OK',
        onPress: () => this.onPressSignOut()
      }
    ],
      { cancelable: false },
    )
  }

  onPressSignOut = async () => {
    await ls.removeLogin();
    Actions.Login({ type: 'reset' });
  }
  fetchData = async () => {
    let dto = {
      userID: this.props.global.currentUser.userID
    }
    let resApi = await userApi.getByID(dto);
    if (resApi.status == 200) {
      this.setState({ dataUser: resApi.data }, () => {
        console.log('====> resApiresApi', resApi.data);
        this.props.actions.onUserFieldChange('fullName', resApi.data.fullName);
        this.props.actions.onUserFieldChange('avatar', resApi.data.avatar);
        this.props.actions.onUserFieldChange('birthDate', resApi.data.birthDate);
        this.props.actions.onUserFieldChange('phone', resApi.data.phone);
      });
    }
    // console.log('====> after updated', resApi.data);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewLinear: {
    flex: 1,
  },
  viewAvatar: {
    marginLeft: 16,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 92,
    marginTop: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  textTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: 24,
    marginLeft: 16,
  },
  textPhone: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginLeft: 16,
  },
  viewBody: {
    width: gui.screenWidth - 32,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 16,
    height: 106,
    marginTop: 44,
  },
  viewRowBody: {
    width: (gui.screenWidth - 32) / 2 - 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#839b97',
  },
  normalTextBody: {
    fontSize: 14,
    color: '#fff',
    marginTop: 15,
  },
  viewLogout: {
    height: 52,
    marginLeft: 16,
    width: gui.screenWidth - 32,
    borderRadius: 8,
    marginTop: 32,
    flexDirection: 'row',
    backgroundColor: '#839b97',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewRowLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  textLogout: {
    fontSize: 17,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textFooter: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.6,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);