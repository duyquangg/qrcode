// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     TextInput,
//     Platform,
//     StyleSheet,
//     StatusBar,
//     Alert
// } from 'react-native';
// import * as Animatable from 'react-native-animatable';
// import LinearGradient from 'react-native-linear-gradient';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { Actions } from 'react-native-router-flux';

// import { useTheme } from 'react-native-paper';
// import Firebase from '../firebase/FirebaseConfig';

// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import { Map } from 'immutable';

// import * as globalActions from '../../reducers/global/globalActions';

// import ls from '../../lib/localStorage';


// const actions = [
//     globalActions
// ];

// function mapStateToProps(state) {
//     return {
//         ...state
//     };
// }

// function mapDispatchToProps(dispatch) {
//     const creators = Map()
//         .merge(...actions)
//         .filter(value => typeof value === 'function')
//         .toObject();

//     return {
//         actions: bindActionCreators(creators, dispatch),
//         dispatch
//     };
// }

// const Login = () => {

//     const [data, setData] = useState({
//         email: '',
//         password: '',
//         check_textInputChange: false,
//         secureTextEntry: true,
//         isValidUser: true,
//         isValidPassword: true,
//     });

//     const { colors } = useTheme();

//     const textInputChange = (val) => {
//         if (val.trim().length >= 4) {
//             setData({
//                 ...data,
//                 email: val,
//                 check_textInputChange: true,
//                 isValidUser: true
//             });
//         } else {
//             setData({
//                 ...data,
//                 email: val,
//                 check_textInputChange: false,
//                 isValidUser: false
//             });
//         }
//     }

//     const handlePasswordChange = (val) => {
//         if (val.trim().length >= 8) {
//             setData({
//                 ...data,
//                 password: val,
//                 isValidPassword: true
//             });
//         } else {
//             setData({
//                 ...data,
//                 password: val,
//                 isValidPassword: false
//             });
//         }
//     }

//     const updateSecureTextEntry = () => {
//         setData({
//             ...data,
//             secureTextEntry: !data.secureTextEntry
//         });
//     }

//     const handleValidUser = (val) => {
//         if (val.trim().length >= 4) {
//             setData({
//                 ...data,
//                 isValidUser: true
//             });
//         } else {
//             setData({
//                 ...data,
//                 isValidUser: false
//             });
//         }
//     }

//     const loginHandle = (email, password) => {
//         this.props.actions.login(email, password).then(e => console.log('====> e',e))
//         // .then(async (res) => {
//         //     console.log('====> res',res);
//         //     // if (res.status === 200) {
//         //     //   this.setState({progressLogin: false}, () => {
//         //     //       Actions.Main();
//         //     //   });
//         //     // } else {
//         //     //     Alert.alert('Thông báo', 'Mật khẩu hoặc tài khoản không đúng! Bạn vui lòng thử lại')
//         //     //     // this.setState({progressLogin: false});
//         //     // }
//         // })
//         // .catch((res) => {
//         //   Alert.alert('Thông báo', 'Quá trình đăng nhập xảy ra lỗi. Bạn vui lòng thử lại sau')
//         // })
//         Firebase.auth().onAuthStateChanged(user => {
//             if (user) {
//                 // this.props.getUser(user.uid);
//                 // console.log('======> user', user);
//                 if (this.props.global.email != null) {
//                     Actions.Home();
//                 }
//             }
//         })

//         // const foundUser = Users.filter(item => {
//         //   return email == item.email && password == item.password;
//         // });

//         // if (data.email.length == 0 || data.password.length == 0) {
//         //     Alert.alert('Wrong Input!', 'email or password field cannot be empty.', [
//         //         { text: 'Okay' }
//         //     ]);
//         //     return;
//         // }

//         // if (foundUser.length == 0) {
//         //     Alert.alert('Invalid User!', 'email or password is incorrect.', [
//         //         { text: 'Okay' }
//         //     ]);
//         //     return;
//         // }
//         // if (foundUser) {
//         //     let dto = {
//         //         email: foundUser[0].email,
//         //         password: foundUser[0].password,
//         //         id: foundUser[0].id,
//         //         userToken: foundUser[0].userToken
//         //     }
//         //     ls.setLoginInfo(dto);
//         //     Actions.Home();
//         // }
//     }

//     return (
//         <View style={styles.container}>
//             <StatusBar backgroundColor='#FF6347' barStyle="light-content" />
//             <View style={styles.header}>
//                 <Text style={styles.text_header}>Welcome!</Text>
//             </View>
//             <Animatable.View
//                 animation="fadeInUpBig"
//                 style={[styles.footer, {
//                     backgroundColor: colors.background
//                 }]}
//             >
//                 <Text style={[styles.text_footer, {
//                     color: colors.text
//                 }]}>email</Text>
//                 <View style={styles.action}>
//                     <FontAwesome
//                         name="user-o"
//                         color={colors.text}
//                         size={20}
//                     />
//                     <TextInput
//                         placeholder="Your email"
//                         placeholderTextColor="#666666"
//                         style={[styles.textInput, {
//                             color: colors.text
//                         }]}
//                         autoCapitalize="none"
//                         onChangeText={(val) => textInputChange(val)}
//                         onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
//                     />
//                     {data.check_textInputChange ?
//                         <Animatable.View
//                             animation="bounceIn"
//                         >
//                             <FontAwesome
//                                 name="check-circle"
//                                 color="green"
//                                 size={20}
//                             />
//                         </Animatable.View>
//                         : null}
//                 </View>
//                 {data.isValidUser ? null :
//                     <Animatable.View animation="fadeInLeft" duration={500}>
//                         <Text style={styles.errorMsg}>email must be 4 characters long.</Text>
//                     </Animatable.View>
//                 }


//                 <Text style={[styles.text_footer, {
//                     color: colors.text,
//                     marginTop: 35
//                 }]}>Password</Text>
//                 <View style={styles.action}>
//                     <FontAwesome
//                         name="lock"
//                         color={colors.text}
//                         size={20}
//                     />
//                     <TextInput
//                         placeholder="Your Password"
//                         placeholderTextColor="#666666"
//                         secureTextEntry={data.secureTextEntry ? true : false}
//                         style={[styles.textInput, {
//                             color: colors.text
//                         }]}
//                         autoCapitalize="none"
//                         onChangeText={(val) => handlePasswordChange(val)}
//                     />
//                     <TouchableOpacity
//                         onPress={updateSecureTextEntry}
//                     >
//                         {data.secureTextEntry ?
//                             <FontAwesome
//                                 name="eye-slash"
//                                 color="grey"
//                                 size={20}
//                             />
//                             :
//                             <FontAwesome
//                                 name="eye"
//                                 color="grey"
//                                 size={20}
//                             />
//                         }
//                     </TouchableOpacity>
//                 </View>
//                 {data.isValidPassword ? null :
//                     <Animatable.View animation="fadeInLeft" duration={500}>
//                         <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
//                     </Animatable.View>
//                 }


//                 <TouchableOpacity>
//                     <Text style={{ color: '#FF6347', marginTop: 15 }}>Forgot password?</Text>
//                 </TouchableOpacity>
//                 <View style={styles.button}>
//                     <TouchableOpacity
//                         style={styles.signIn}
//                         onPress={() => { loginHandle(data.email, data.password) }}
//                     >
//                         <LinearGradient
//                             colors={['#FFA07A', '#FF6347']}
//                             style={styles.signIn}
//                         >
//                             <Text style={[styles.textSign, {
//                                 color: '#fff'
//                             }]}>Sign In</Text>
//                         </LinearGradient>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         onPress={() => Actions.Signup()}
//                         style={[styles.signIn, {
//                             borderColor: '#FF6347',
//                             borderWidth: 1,
//                             marginTop: 15
//                         }]}
//                     >
//                         <Text style={[styles.textSign, {
//                             color: '#FF6347'
//                         }]}>Sign Up</Text>
//                     </TouchableOpacity>
//                 </View>
//             </Animatable.View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#FF6347'
//     },
//     header: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         paddingHorizontal: 20,
//         paddingBottom: 50
//     },
//     footer: {
//         flex: 3,
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 30,
//         borderTopRightRadius: 30,
//         paddingHorizontal: 20,
//         paddingVertical: 30
//     },
//     text_header: {
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: 30
//     },
//     text_footer: {
//         color: '#05375a',
//         fontSize: 18
//     },
//     action: {
//         flexDirection: 'row',
//         marginTop: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#f2f2f2',
//         paddingBottom: 5
//     },
//     actionError: {
//         flexDirection: 'row',
//         marginTop: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#FF0000',
//         paddingBottom: 5
//     },
//     textInput: {
//         flex: 1,
//         marginTop: Platform.OS === 'ios' ? 0 : -12,
//         paddingLeft: 10,
//         color: '#05375a',
//     },
//     errorMsg: {
//         color: '#FF0000',
//         fontSize: 14,
//     },
//     button: {
//         alignItems: 'center',
//         marginTop: 50
//     },
//     signIn: {
//         width: '100%',
//         height: 50,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 10
//     },
//     textSign: {
//         fontSize: 18,
//         fontWeight: 'bold'
//     }
// });


// export default connect(mapStateToProps, mapDispatchToProps)(Login);

import React, { Component } from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import Firebase from '../firebase/FirebaseConfig';
import ls from '../../lib/localStorage';
import * as globalActions from '../../reducers/global/globalActions';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			checkLogin: true,
		}
	}
	componentDidMount(){
		Firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.setState({checkLogin: false})
				// this.props.actions.getUser(user.uid);
				console.log('======> user', user);
				// if (this.props.global.email != null) {
				// 	Actions.Home();
				// }
			}
			this.onLoginPress.bind(this);
		})
	}
	componentWillUnmount() {
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state,callback)=>{
			return;
		};
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
				<TouchableOpacity style={styles.button} onPress={this.onLoginPress.bind(this)}>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>
				<Button
					title="Don't have an account yet? Sign up"
					onPress={() => Actions.Signup()}
				/>
			</View>
		)
	}
	onLoginPress() {
		let { email, password } = this.state;
		if(email && password){
			let dto = {
				email,
				password
			}
			this.props.actions.login(email,password);
			this.props.onGlobalFieldChange('email',email);
			Actions.Home();
			ls.setLoginInfo(dto);
			this.setState({
				email: '',
				password: ''
			})
		}
		// if (!this.validate()){
		//   return;
		// }
		// 	this.setState({progressLogin: true});
		// 	  let userDto = {
		// 		  username: this.state.username,
		// 		  password: this.state.password
		// 	  };
		// 	  this.props.actions.login(username, password)
		// 		  .then(async (res) => {
		// 			log.info('=======> res login',res);
		// 			  if (res.status === 200) {
		// 				this.setState({progressLogin: false}, () => {
		// 					Actions.Main();
		// 				});
		// 			  } else {
		// 				  Alert.alert('Thông báo', 'Mật khẩu hoặc tài khoản không đúng! Bạn vui lòng thử lại')
		// 				  this.setState({progressLogin: false});
		// 			  }
		// 		  })
		// 		  .catch((res) => {
		// 			Alert.alert('Thông báo', 'Quá trình đăng nhập xảy ra lỗi. Bạn vui lòng thử lại sau')
		// 		  })
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
	buttonSignup: {
		fontSize: 12
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
export default connect(mapStateToProps, mapDispatchToProps)(Login)