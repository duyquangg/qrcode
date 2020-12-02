const {
	UPDATE_EMAIL,
	UPDATE_PASSWORD,
	LOGIN,
	SIGNUP,
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
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

		case LOGIN_REQUEST: {
			let newState = state
				.set("isLoggin", true);
			;
			return newState;
		}
		case LOGIN_FAILURE: {
			let newState = state
				.set("isLoggin", false);
			;
			return newState;
		}
		case LOGIN_SUCCESS: {
			log.info('=====> action.payload', action.payload);
			let data = action.payload.data;
			let newState = state
				// .setIn(['currentUser', 'userID'], data.userID)
				// .setIn(['currentUser', 'token'], action.payload.token)
				// .setIn(["currentUser", "username"], data.username)
				// .setIn(["currentUser", "phone"], data.phone)
				// .setIn(['currentUser', 'email'], data.email)
				// .setIn(['currentUser', 'fullName'], data.fullName)
				.setIn("email", data.email)
				.setIn("password", data.password)
				.set("loggedIn", true)
				.set("isLoggin", false)


			return newState;
		}
		default:
			return state
	}
}
