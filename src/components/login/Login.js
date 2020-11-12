import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native'
import {Actions } from 'react-native-router-flux';

import Firebase from '../firebase/FirebaseConfig';

class Login extends React.Component {
    state = {
        email: '',
        password: ''
    }

    handleLogin = () => {
        const { email, password } = this.state

        Firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => Actions.Home())
            .catch(error => console.log(error))
    }
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.inputBox}
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                    placeholder='Email'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.inputBox}
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Actions.Signup()}>
                    <Text style={styles.buttonSignupText}>Don't have an account yet? Sign up</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center'
    },
    button: {
        marginTop: 30,
        marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#F6820D',
        borderColor: '#F6820D',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    buttonSignupText: {
        fontSize: 20,
        color: 'blue'
    },
    buttonSignup: {
        fontSize: 12
    }
})

export default Login