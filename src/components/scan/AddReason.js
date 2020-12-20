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

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            checkLogin: true,

            checkPass: true,
            checkConfirmPass: true,

            loading: false,
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
    render() {
        return (
            <View style={styles.container}>
                {this._renderHeader()}
                <KeyboardAwareScrollView
                    style={{ flex: 1, width: '100%' }}
                    keyboardShouldPersistTaps="always"
                >
                    <TextInput
                        style={styles.viewInput}
                        placeholderTextColor="#a6a9b6"
                        placeholder='Lý do...'
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonTitle}>Gửi</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
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
    title: {

    },
    logo: {
        flex: 1,
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30,
        marginTop: 100,
    },
    viewInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 30,
        height: 48,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#34626c',
        paddingHorizontal: 16
    },
    inputPass: {
        height: 46,
        borderRadius: 5,
        width: gui.screenWidth - 110,
        color: '#000',
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        color: '#000',
        borderWidth: 1,
        borderColor: '#34626c',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button: {
        backgroundColor: '#34626c',
        marginLeft: 30,
        marginRight: 30,
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
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#a6a9b6'
    },
    footerLink: {
        color: "#34626c",
        fontWeight: "bold",
        fontSize: 16
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup)