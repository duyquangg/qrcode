const {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    ON_GLOBAL_FIELD_CHANGE,
    ON_USER_FIELD_CHANGE
} = require('../../lib/constants').default;
import userApi from '../../lib/userApi';
import ls from "../../lib/localStorage";


export function onGlobalFieldChange(field, value) {
    return {
        type: ON_GLOBAL_FIELD_CHANGE,
        payload: { field: field, value: value }
    };
}

export function onUserFieldChange(field, value) {
    return {
        type: ON_USER_FIELD_CHANGE,
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
        let dto = {
            "email": email,
            "password": password
        }
        return userApi.login(email, password)
            .then(function (json) {
                // console.log("Login success data action", json);
                if (json.status == 200) {
                    ls.setLoginInfo(dto);
                    dispatch(loginSuccess(json));
                } else {
                    dispatch(loginFailure(json.error));
                }
                return json;
            });
    };
}