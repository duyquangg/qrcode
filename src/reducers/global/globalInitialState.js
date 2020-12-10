'use strict';

import {Record} from 'immutable';

var InitialState = Record({
    email: null,
    loggedIn : false,
    isLoggin : false,

    checkIn: null,
    checkOut: null,
});

export default InitialState;
