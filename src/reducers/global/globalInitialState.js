'use strict';

import {Record} from 'immutable';

var InitialState = Record({
    currentUser: new (Record({
        userID : null,
        token:'',
        username: '',
        fullName : '',


        email: '',
        password: '',
    })),
    email: '',
    password: '',

    // deviceInfo : {
    //     deviceID : null,
    //     deviceModel: null,
    //     tokenID : null,
    //     tokenOs : null,
    //     tokenRegistered: false,
    //     appVersion: null
    // },

    // appInfo : {
    //     version : null,
    //     platform: null
    // },

    // loggedIn : false,
    // isLoggin : false,
    // savedPassword: false,
    // scene : {},
    // prevScene: {},
    // mountTabCv: 1,
    // imageUploading: false,
});

export default InitialState;
