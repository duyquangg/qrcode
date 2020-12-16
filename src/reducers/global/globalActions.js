import Firebase, { db } from '../../components/firebase/FirebaseConfig';

const {
	LOGIN,
	SIGNUP,
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	ON_GLOBAL_FIELD_CHANGE,
} = require('../../lib/constants').default;
import userApi from '../../lib/userApi';
import ls from "../../lib/localStorage";


export function onGlobalFieldChange(field, value) {
	return {
		type: ON_GLOBAL_FIELD_CHANGE,
		payload: { field: field, value: value }
	};
}


export function loginRequest() {
    return {
        type: LOGIN_REQUEST
    };
}

export function loginSuccess(user) {
    return {
        type: LOGIN_SUCCESS,
        payload: user
    };
}
export function loginFailure(error) {
    return {
        type: LOGIN_FAILURE,
        payload: error
    };
}

export function login(email, password) {
    return dispatch => {
        dispatch(loginRequest());
        return userApi.login(email, password)
            .then(function (json) {
                console.log("Login success data action", json);
                if (json.status === 200) {
                    // let token = json.token;
                    ls.setLoginInfo({ email, password });
                    dispatch(loginSuccess(json));
                } else {
                    dispatch(loginFailure(json.error));
                }
                return json;
            });
    };
}