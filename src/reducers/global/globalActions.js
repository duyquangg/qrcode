import Firebase, { db } from '../../components/firebase/FirebaseConfig';

// define types
const {
	UPDATE_EMAIL,
    UPDATE_PASSWORD,
    LOGIN,
	SIGNUP,
	LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
} = require('../../lib/constants').default;

// actions

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


// export function login(username, password) {
//     return dispatch => {
//         dispatch(loginRequest());
//         return userApi.login(username, password)
//             .then(function (json) {
//                 log.info("Login success data action", json);
//                 if (json.status === 200) {
//                     let token = json.token;
//                     ls.setLoginInfo({ username, password, token });
//                     dispatch(loginSuccess(json));
//                 } else {
//                     dispatch(loginFailure(json.error));
//                 }

//                 return json;
//             });
//     };
// }

export const login = (email, password) => {
	return async dispatch => {
		dispatch(loginRequest())
		try {
			const response = await Firebase.auth().signInWithEmailAndPassword(email, password)
			dispatch(loginSuccess(response))
		} catch (e) {
			alert(e)
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