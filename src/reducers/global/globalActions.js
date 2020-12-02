import Firebase, { db } from '../../components/firebase/FirebaseConfig';

const {
	UPDATE_EMAIL,
    UPDATE_PASSWORD,
    LOGIN,
	SIGNUP,
	LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
} = require('../../lib/constants').default;

import ls from "../../lib/localStorage";


export const updateEmail = email => {
	return {
		type: UPDATE_EMAIL,
		payload: email
	}
}

export const updatePassword = password => {
	return {
		type: UPDATE_PASSWORD,
		payload: password
	}
}

export function onChatGlobalChange(field, value) {
    return {
        type: ON_GLOBAL_FIELD_CHANGE,
        payload: {field: field, value: value}
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

export const login = (email, password) => {
	return async dispatch => {
		dispatch(loginRequest())
		try {
			let response = await Firebase.auth().signInWithEmailAndPassword(email, password);
			ls.setLoginInfo({ email, password });
			dispatch(loginSuccess(response))
		} catch (e) {
			if(!email){
				alert('k co email');
			}
			if(!password){
				alert('k co password')
			}
		}
	}
}

export const getUser = uid => {
	return async (dispatch, getState) => {
		try {
			const user = await db
				.collection('users')
				.doc(uid)
				.get()

			dispatch({ type: LOGIN, payload: user.data() })
		} catch (e) {
			alert(e)
		}
	}
}

export const signup = () => {
	return async (dispatch, getState) => {
		try {
			const { email, password } = getState().user
			const response = await Firebase.auth().createUserWithEmailAndPassword(email, password)
			if (response.user.uid) {
				const user = {
					uid: response.user.uid,
					email: email
				}

				db.collection('users')
					.doc(response.user.uid)
					.set(user)

				dispatch({ type: SIGNUP, payload: user })
			}
		} catch (e) {
			alert(e)
		}
	}
}