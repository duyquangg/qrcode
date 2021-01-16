import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    RefreshControl,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Toast from "../toast/Toast";
import CommonHeader from '../header/CommonHeader';
import gui from '../../lib/gui';

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
class DetailUser extends Component {
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
                title={"Chi tiết thành viên"}
                leftContent={<FontAwesome name={'chevron-left'} color={'#fff'} size={20} />}
                onPressLeft={() => Actions.pop()}
            />
        );
    }
    _renderBody() {
        let { item } = this.props;
        let AvaUser = require('../../assets/images/user.png');
        console.log('====> item', item);
        return (
            <View style={styles.body}>
                {item.avatar == null
                    ? <Image source={AvaUser} style={[styles.avatar, { borderRadius: 0 }]} />
                    :
                    <Image
                        source={{ uri: item.avatar }}
                        style={styles.avatar}
                    />
                }
                {this._renderRow('Họ tên', item.fullName)}
                {this._renderRow('Email', item.email)}
                {this._renderRow('Số điện thoại', item.phone)}
                {this._renderRow('Ngày sinh', item.birthDate)}
                {this._renderRow('Giới tính', item.gender == "male" ? "Nam" : (item.gender == "female" ? "Nữ" : "Không có"))}
            </View>
        );
    };
    _renderRow = (label, value) => {
        return (
            <View style={{ alignSelf: 'center' }}>
                <View style={styles.viewRowBody}>
                    <Text>{label}: </Text>
                    {value ? 
                        <Text>{value}</Text>
                        :
                        <Text>Không có</Text>
                    }
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    body: {
        flex: 1
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginTop: 30,
        marginBottom: 15,
        alignSelf: 'center',
    },
    viewRowBody: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft:50,
        marginTop: 5,
        width: 300,
        // backgroundColor:'red'
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(DetailUser);