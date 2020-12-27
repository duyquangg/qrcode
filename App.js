import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppRouter from './src/AppRouter';

import configureStore from './src/lib/configureStore';
import globalInitialState from './src/reducers/global/globalInitialState';
import ls from './src/lib/localStorage';
import {login} from './src/reducers/global/globalActions';

function getInitialState() {
	const _initState = {
		global: new globalInitialState,
	};
	return _initState;
}
const store = configureStore(getInitialState());

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}
	componentDidMount() {
		let state = store.getState();
		if (state.global) {
			ls.getLoginInfo().then( (ret)=> {
				if (ret){
					store.dispatch(login(ret.email, ret.password)).then((json) => {
						// console.log('====> json',json)
						// if (json.login === true) {
						// 	userInfo.userID = json.userID;
						// }
						// this.hideSplashScreen();
					});
				} else {
					// this.hideSplashScreen();
				}
			});
		} else {
			// this.hideSplashScreen();
		};
	};
	render() {
		return (
			<Provider store={store}>
				<AppRouter />
			</Provider>
		)
	}
}