const {
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
    ON_GLOBAL_FIELD_CHANGE,
    ON_USER_FIELD_CHANGE
} = require('../../lib/constants').default;
import InitialState from './globalInitialState';

const initialState = new InitialState;
export default function globalReducer(state = initialState, action) {
	if (!(state instanceof InitialState)) return initialState.merge(state);
	switch (action.type) {
		case ON_GLOBAL_FIELD_CHANGE: {
            const {field, value} = action.payload;
            let nextState = state.set(field, value);
            return nextState;
        }
        case ON_USER_FIELD_CHANGE: {
            const {field, value} = action.payload;
            let nextState = state.setIn(['currentUser',field], value);
            return nextState;
		}
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
            let data = action.payload.data;
            // console.log('====> data success',data);
            let newState = state
                .setIn(['currentUser','userID'], data.id)
                .setIn(["currentUser", "email"], data.email)
                .setIn(["currentUser", "role"], data.role)
                .setIn(['currentUser','fullName'], data.fullName)
                .setIn(['currentUser','phone'], data.phone)
                .setIn(['currentUser','gender'], data.gender)
                .setIn(['currentUser','avatar'], data.avatar)
                .setIn(['currentUser','birthDate'], data.birthDate)
                .set("loggedIn", true)
                .set("isLoggin", false)
            return newState;
        }
		default:
			return state
	}
}
