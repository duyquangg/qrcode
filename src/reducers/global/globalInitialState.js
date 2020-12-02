'use strict';

import {Record} from 'immutable';

var InitialState = Record({
    email: '',
    password: '',
    loggedIn : false,
    isLoggin : false,
    // savedPassword: false,
    // scene : {},
    // prevScene: {},
    // mountTabCv: 1,
    // imageUploading: false,
});

export default InitialState;
