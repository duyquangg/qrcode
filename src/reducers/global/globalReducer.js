const {
	UPDATE_EMAIL,
    UPDATE_PASSWORD,
    LOGIN,
    SIGNUP 
} = require('../../lib/constants').default;
import InitialState from './globalInitialState';

const initialState = new InitialState;
export default function globalReducer(state = initialState, action) {
	if (!(state instanceof InitialState)) return initialState.merge(state);
	switch (action.type) {
		case LOGIN:
			return action.payload
		case SIGNUP:
			return action.payload
		case UPDATE_EMAIL:
			return { ...state, email: action.payload }
		case UPDATE_PASSWORD:
			return { ...state, password: action.payload }
		default:
			return state
	}
}
