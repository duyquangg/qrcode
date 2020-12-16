'use strict';

import {Record} from 'immutable';

var InitialState = Record({
    currentUser: new (Record({
        userID : null,
        username: '',
        fullName : '',
        phone : '',
        email: '',
        avatar:'',
        role: [],
    })),
    loggedIn : false,
    isLoggin : false,

    checkIn: null,
    checkOut: null,
    dataUser: {},
    tabScan: false,
    tabProfile: false
});

export default InitialState;
