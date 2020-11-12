import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import AppRouter from './src/AppRouter';
import reducer from './src/redux/reducers';

const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducer, middleware)

export default class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<AppRouter />
			</Provider>
		)
	}
}