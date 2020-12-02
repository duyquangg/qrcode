import React from 'react';
import { Provider } from 'react-redux';
import AppRouter from './src/AppRouter';

import configureStore from './src/lib/configureStore';
import globalInitialState from './src/reducers/global/globalInitialState';

function getInitialState() {
	const _initState = {
	  global: new globalInitialState,
	};
	return _initState;
  }
const store = configureStore(getInitialState());

export default class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<AppRouter />
			</Provider>
		)
	}
}