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

import Firebase, { db } from '../firebase/FirebaseConfig';
import * as globalActions from '../../reducers/global/globalActions';

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
                    // source={require('../../../assets/icon.png')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Full Name'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(fullName) => this.setState({ fullName })}
                        value={this.state.fullName}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='E-mail'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <View style={styles.viewInput}>
                        <TextInput
                            style={styles.inputPass}
                            placeholderTextColor="#aaaaaa"
                            secureTextEntry={this.state.checkPass ? true : false}
                            placeholder='Password'
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
                                    color="grey"
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
                            placeholder='Confirm Password'
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
                                    color="grey"
                                    size={20}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.onRegisterPress.bind(this)}
                    >
                        <Text style={styles.buttonTitle}>Create account</Text>
                    </TouchableOpacity>
                    <View style={styles.footerView}>
                        <Text style={styles.footerText}>Already got an account? <Text onPress={() => Actions.Login()} style={styles.footerLink}>Log in</Text></Text>
                    </View>
                    <Loader loading={this.state.loading}/>
                </KeyboardAwareScrollView>
            </View>
        )
    }
    onRegisterPress = () => {
        let { email, password, confirmPassword, fullName } = this.state;
        if (password !== confirmPassword) {
            alert("Passwords don't match")
            return
        }
        this.setState({ loading: true })
        Firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                this.setState({loading: false})
                const data = {
                    email,
                    fullName,
                };
                db.collection('users')
                    .doc(response.user.uid)
                    .set(data)
                    .then(() => {
                        Actions.Home();
                        Alert.alert('Thông báo', 'Bạn đã tạo tài khoản thành công!')
                        this.setState({
                            email: '',
                            password: '',
                            confirmPassword: '',
                            fullName: '',
                            loading: false
                        })
                    })
                    .catch((error) => {
                        alert(error)
                    });
            })
            .catch((error) => {
                alert(error);
                this.setState({loading: false})
            });
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
        margin: 30
    },
    viewInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 30,
        height: 48,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#788eec',
        paddingHorizontal: 16
    },
    inputPass: {
        height: 46,
        borderRadius: 5,
        width: gui.screenWidth - 110,
        color:'#000',
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        color:'#000',
        borderWidth: 1,
        borderColor: '#788eec',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button: {
        backgroundColor: '#788eec',
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
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#788eec",
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