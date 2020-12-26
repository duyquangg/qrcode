import React, { Component } from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import gui from '../../lib/gui';
import Loader from '../icons/Loader';
import Toast from '../toast/Toast';
import CommonHeader from '../header/CommonHeader';

import * as globalActions from '../../reducers/global/globalActions';
import userApi from '../../lib/userApi';

class AddReason extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            reason: '',
            typeReason: 'leave',
        }
    }
    _renderHeader = () => {
        return (
            <CommonHeader
                title={"Báo nghỉ / Đi muộn"}
                leftContent={<FontAwesome name={'chevron-left'} color={'#fff'} size={20} />}
                onPressLeft={() => Actions.pop()}
            />
        )
    };
    _renderBody = () => {
        let { typeReason } = this.state;
        let oval = require('../../assets/images/oval-copy.png');
        let ovalNone = require('../../assets/images/ovalNone.png');
        let _renderTypeReason = (type, title) => {
            return (
                <TouchableOpacity
                    style={styles.viewChooseSex}
                    onPress={() => {
                        this.setState({ typeReason: type });
                    }}
                >
                    {typeReason == type
                        ? <Image source={oval} />
                        : <Image source={ovalNone} />}
                    <Text style={styles.sexText}>{title}</Text>
                </TouchableOpacity>
            )
        }
        return (
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always"
            >
                <Text style={styles.labelText}>Chọn lý do</Text>
                <View style={styles.viewChoose}>
                    {_renderTypeReason('leave', 'Báo nghỉ')}
                    {_renderTypeReason('late', 'Đi muộn')}
                    <View />
                </View>
                <Text style={styles.labelText}>Chọn ngày</Text>
                <View style={styles.viewInput}>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#a6a9b6"
                        placeholder='Lý do...'
                        multiline
                        onChangeText={(reason) => this.setState({ reason })}
                        value={this.state.reason}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                </View>
                <TouchableOpacity onPress={this.onSend.bind(this)} style={styles.button}>
                    <Text style={styles.buttonTitle}>Gửi</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        )
    }
    onSend = () => {
        let { typeReason, reason } = this.state;
        if (!reason) {
            this.refs.toastTop.show('Lý do không được để trống!');
            return;
        };
        console.log('===>typeReason ',typeReason);


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
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    labelText: {
        fontSize: 12,
        color: '#627792',
        marginLeft: 16,
        marginTop: 20,
    },
    viewChoose: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
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
    viewInput: {
        marginHorizontal: 16,
        height: 48,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#34626c',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 30,
        width: gui.screenWidth - 32,
        paddingHorizontal: 16,
    },
    button: {
        backgroundColor: '#34626c',
        marginHorizontal: 16,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
})

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

export default connect(mapStateToProps, mapDispatchToProps)(AddReason)