import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';

const Signup = () => {

    const [data, setData] = React.useState({
        username: '',
        password: '',
        confirm_password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });

    const textInputChange = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#FF6347' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Register Now!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <ScrollView>
            <Text style={styles.text_footer}>Username</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Username"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <FontAwesome 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Password"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
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

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Confirm Password</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Confirm Your Password"
                    secureTextEntry={data.confirm_secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handleConfirmPasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateConfirmSecureTextEntry}
                >
                    {data.confirm_secureTextEntry ? 
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
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => {}}
                >
                <LinearGradient
                    colors={['#FFA07A', '#FF6347']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Sign Up</Text>
                </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => Actions.pop()}
                    style={[styles.signIn, {
                        borderColor: '#FF6347',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#FF6347'
                    }]}>Sign In</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </Animatable.View>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#FF6347'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
  });

  export default Signup;


// import React from 'react'
// import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native'
// import {Actions} from 'react-native-router-flux';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import { updateEmail, updatePassword, signup } from '../../redux/actions/user';

// class Signup extends React.Component {
// 	handleSignUp = () => {
// 		this.props.signup()
// 		Actions.Home();
// 	}

// 	render() {
// 		return (
// 			<View style={styles.container}>
// 				<TextInput
// 					style={styles.inputBox}
// 					value={this.props.user.email}
// 					onChangeText={email => this.props.updateEmail(email)}
// 					placeholder='Email'
// 					autoCapitalize='none'
// 				/>
// 				<TextInput
// 					style={styles.inputBox}
// 					value={this.props.user.password}
// 					onChangeText={password => this.props.updatePassword(password)}
// 					placeholder='Password'
// 					secureTextEntry={true}
// 				/>
// 				<TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
// 					<Text style={styles.buttonText}>Signup</Text>
// 				</TouchableOpacity>
// 			</View>
// 		)
// 	}
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: '#fff',
// 		alignItems: 'center',
// 		justifyContent: 'center'
// 	},
// 	inputBox: {
// 		width: '85%',
// 		margin: 10,
// 		padding: 15,
// 		fontSize: 16,
// 		borderColor: '#d3d3d3',
// 		borderBottomWidth: 1,
// 		textAlign: 'center'
// 	},
// 	button: {
// 		marginTop: 30,
// 		marginBottom: 20,
// 		paddingVertical: 5,
// 		alignItems: 'center',
// 		backgroundColor: '#FFA611',
// 		borderColor: '#FFA611',
// 		borderWidth: 1,
// 		borderRadius: 5,
// 		width: 200
// 	},
// 	buttonText: {
// 		fontSize: 20,
// 		fontWeight: 'bold',
// 		color: '#fff'
// 	},
// 	buttonSignup: {
// 		fontSize: 12
// 	}
// })

// const mapDispatchToProps = dispatch => {
// 	return bindActionCreators({ updateEmail, updatePassword, signup }, dispatch)
// }

// const mapStateToProps = state => {
// 	return {
// 		user: state.user
// 	}
// }

// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(Signup)