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
import ls from '../../lib/localStorage';
import Toast from '../toast/Toast';

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
    render() {
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    style={{ flex: 1, width: '100%' }}
                    keyboardShouldPersistTaps="always">
                    <Image
                        style={styles.logo}
                        source={require('../../assets/images/ptit.png')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Họ và tên'
                        placeholderTextColor="#a6a9b6"
                        onChangeText={(fullName) => this.setState({ fullName })}
                        value={this.state.fullName}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Email'
                        keyboardType={'email-address'}
                        placeholderTextColor="#a6a9b6"
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <View style={styles.viewInput}>
                        <TextInput
                            style={styles.inputPass}
                            placeholderTextColor="#a6a9b6"
                            secureTextEntry={this.state.checkPass ? true : false}
                            placeholder='Mật khẩu'
                            onChangeText={(password) => this.setState({ password })}
                            value={this.state.password}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => this.setState({ checkPass: !this.state.checkPass })}
                        >
                            {this.state.checkPass ?
                                <FontAwesome
                                    name="eye-slash"
                                    color="grey"
                                    size={20}
                                />
                                :
                                <FontAwesome
                                    name="eye"
                                    color="#34626c"
                                    size={20}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.viewInput, { marginTop: 10 }]}>
                        <TextInput
                            style={styles.inputPass}
                            placeholderTextColor="#aaaaaa"
                            secureTextEntry={this.state.checkConfirmPass ? true : false}
                            placeholder='Xác nhận mật khẩu'
                            onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                            value={this.state.confirmPassword}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => this.setState({ checkConfirmPass: !this.state.checkConfirmPass })}
                        >
                            {this.state.checkConfirmPass ?
                                <FontAwesome
                                    name="eye-slash"
                                    color="grey"
                                    size={20}
                                />
                                :
                                <FontAwesome
                                    name="eye"
                                    color="#34626c"
                                    size={20}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={this.onRegisterPress.bind(this)}>
                        <Text style={styles.buttonTitle}>Tạo tài khoản</Text>
                    </TouchableOpacity>
                    <View style={styles.footerView}>
                        <Text style={styles.footerText}>Bạn đã có tài khoản? <Text onPress={() => Actions.Login()} style={styles.footerLink}>Đăng nhập</Text></Text>
                    </View>
                    <Loader loading={this.state.loading} />
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
    onRegisterPress = () => {
        let { email, password, confirmPassword, fullName } = this.state;
        if (!fullName) {
            this.refs.toastTop.show("Họ và tên không được để trống!");
            return;
        } else if (!email) {
            this.refs.toastTop.show("Email không được để trống!");
            return;
        } else if (!password) {
            this.refs.toastTop.show("Mật khẩu không được để trống!");
            return;
        }
        if (password.length < 6) {
            this.refs.toastTop.show("Mật khẩu cần ít nhất 6 ký tự!");
            return;
        }
        if (password !== confirmPassword) {
            this.refs.toastTop.show("Mật khẩu không khớp rồi!");
            return
        }
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false) {
            this.setState({ email });
            this.refs.toastTop.show("Email không đúng định dạng!");
            return false;
        } else {
            userApi.register(email, password, fullName)
                .then(e => {
                    this.setState({ loading: true })
                    if (e.status == 200) {
                        Alert.alert('Thông báo', 'Bạn đã tạo tài khoản thành công! Mời bạn đăng nhập lại vào hệ thống!');
                        Actions.Login();
                        this.setState({
                            email: '',
                            password: '',
                            confirmPassword: '',
                            fullName: '',
                            loading: false
                        });
                    }
                })
                .catch((res) => {
					this.refs.toastTop.show("Quá trình đăng ký xảy ra lỗi. Bạn vui lòng thử lại sau");
				})
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
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