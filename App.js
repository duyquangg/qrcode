import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppRouter from './src/AppRouter';

import configureStore from './src/lib/configureStore';
import globalInitialState from './src/reducers/global/globalInitialState';
import ls from './src/lib/localStorage';
import Firebase, { db } from './src/components/firebase/FirebaseConfig';


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
	componentDidMount = async () => {
		let state = store.getState();
		// console.log('====> state',state);
	};
	componentWillUnmount() {
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
			return;
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