import React, { Component } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import gui from '../../lib/gui';
import userApi from '../../lib/userApi';

import Toast from '../toast/Toast';
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
		console.log("Dataaa" + nextProps.payload.payloadData); // Display [Object Object]
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
						source={require('../../assets/images/ptit.png')}
					/>
					<TextInput
						style={styles.input}
						placeholder='Email'
						placeholderTextColor="#a6a9b6"
						onChangeText={(email) => this.setState({ email })}
						value={this.state.email}
						keyboardType={'email-address'}
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
					<TouchableOpacity
						style={styles.button}
						onPress={this.onLoginPress.bind(this)}>
						<Text style={styles.buttonTitle}>Đăng nhập</Text>
					</TouchableOpacity>
					<View style={styles.footerView}>
						<Text style={styles.footerText}>Bạn chưa có tài khoản? <Text onPress={() => Actions.Signup()} style={styles.footerLink}>Đăng ký</Text></Text>
					</View>
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
	};
	onLoginPress = async () => {
		let { email, password } = this.state;
		if (!email) {
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
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (reg.test(email) === false) {
			this.setState({ email });
			this.refs.toastTop.show("Email không đúng định dạng!");
			return false;
		} else {
			this.setState({ loading: true });
			let dto = {
				email,
				password
			}
			this.props.actions.login(dto.email, dto.password)
				.then(res => {
					if (res.status === 200) {
						ls.setLoginInfo(dto);
						this.setState({
							email: '',
							password: '',
							loading: false
						});
						Actions.Main({ type: 'reset' });
					} else {
						this.refs.toastTop.show("Mật khẩu hoặc tài khoản không đúng! Bạn vui lòng thử lại");
						this.setState({ loading: false });
					}
				})
				.catch((res) => {
					this.refs.toastTop.show("Quá trình đăng nhập xảy ra lỗi. Bạn vui lòng thử lại sau");
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
		margin: 30,
		marginTop: 100,
		// backgroundColor:'red'
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
		borderColor: '#34626c',
		backgroundColor: 'white',
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 30,
		marginRight: 30,
		paddingLeft: 16,
		paddingHorizontal: 16
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
export default connect(mapStateToProps, mapDispatchToProps)(Login);