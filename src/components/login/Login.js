import React, { Component } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import gui from '../../lib/gui';

import Firebase, { db } from '../firebase/FirebaseConfig';
import Loader from '../icons/Loader';
import ls from '../../lib/localStorage';
import * as globalActions from '../../reducers/global/globalActions';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			checkLogin: true,
			checkPass: true,

			loading: false,
		}
	}
	componentDidMount() {
		// Firebase.auth().onAuthStateChanged(user => {
		// 	if (user) {
		// 		this.setState({ checkLogin: false })
		// 		this.onLoginPress.bind(this, user);
		// 	}
		// })
	}
	componentWillUnmount() {
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
			return;
		};
	}
	UNSAFE_componentWillReceiveProps(nextProps) {       
		console.log("Dataaa"+nextProps.payload.payloadData); // Display [Object Object]
		console.log(nextProps.payload.payloadData);  //  Display proper list
	 }
	render() {
		return (
			<View style={styles.container} >
				<KeyboardAwareScrollView
					style={{ flex: 1, width: '100%' }}
					keyboardShouldPersistTaps="always"
				>
					<Loader loading={this.state.loading} />
					<Image
						style={styles.logo}
					// source={require('../../../assets/icon.png')}
					/>
					<TextInput
						style={styles.input}
						placeholder='Email'
						placeholderTextColor="#aaaaaa"
						onChangeText={(email) => this.setState({ email })}
						value={this.state.email}
						keyboardType={'email-address'}
						underlineColorAndroid="transparent"
						autoCapitalize="none"
					/>
					<View style={styles.viewInput}>
						<TextInput
							style={styles.inputPass}
							placeholderTextColor="#aaaaaa"
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
									color="grey"
									size={20}
								/>
							}
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						style={styles.button}
						onPress={this.onLoginPress.bind(this)}>
						<Text style={styles.buttonTitle}>Đăng nhập</Text>
					</TouchableOpacity>
					<View style={styles.footerView}>
						<Text style={styles.footerText}>Bạn chưa có tài khoản? <Text onPress={() => Actions.Signup()} style={styles.footerLink}>Đăng ký</Text></Text>
					</View>
				</KeyboardAwareScrollView>
			</View>
		)
	};
	onLoginPress = (user) => {
		let { email, password } = this.state;
		if (!email) {
			Alert.alert('Thông báo', 'Email trước không được để trống !');
			return;
		} else if (!password) {
			Alert.alert('Thông báo', 'Mật khẩu không được để trống !');
			return;
		}
		if (password.length < 6) {
			Alert.alert('Thông báo', 'Mật khẩu cần ít nhất 6 ký tự !');
			return;
		}
		//done validated
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (reg.test(email) === false) {
			this.setState({ email });
			Alert.alert('Thông báo', 'Email không đúng định dạng')
			return false;
		} else {
			this.setState({ loading: true });
			Firebase
				.auth()
				.signInWithEmailAndPassword(email, password)
				.then((response) => {
					const uid = response.user.uid
					Firebase.firestore().collection('users')
						.doc(uid)
						.get()
						.then(firestoreDocument => {
							console.log('====> firestoreDocument',firestoreDocument);
							if (!firestoreDocument.exists) {
								Alert.alert('Thông báo','Người dùng không tồn tại !');
								this.setState({ loading: false });
							}
							let dto = {
								email,
								password
							}
							ls.setLoginInfo(dto);
							Actions.Scan({data: dto});
							this.setState({
								email: '',
								password: '',
								loading: false
							})
						})
						.catch(error => {
							this.setState({ loading: false });
							Alert.alert('Thông báoaaa', JSON.stringify(error)); //not Alert.alert(error) cuz it's an obj
						});
				})
				.catch(error => {
					if (error.code === 'auth/user-not-found') {
						Alert.alert('Thông báo', 'Email không tồn tài trong hệ thống !');
						this.setState({ loading: false });
					} else if (error.code === 'auth/wrong-password') {
						Alert.alert('Thông báo', 'Bạn nhập sai mật khẩu rồi !');
						this.setState({ loading: false });
					}
					// Alert.alert('Thông báo', JSON.stringify(error)); //not Alert.alert(error) cuz it's an obj
				})
		}
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
		color: '#000',
		width: gui.screenWidth - 110,
		overflow: 'hidden',
		backgroundColor: 'white',
	},
	input: {
		height: 46,
		borderRadius: 5,
		overflow: 'hidden',
		color: '#000',
		borderWidth: 1,
		borderColor: '#788eec',
		backgroundColor: 'white',
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 30,
		marginRight: 30,
		paddingLeft: 16,
		paddingHorizontal: 16
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
export default connect(mapStateToProps, mapDispatchToProps)(Login);