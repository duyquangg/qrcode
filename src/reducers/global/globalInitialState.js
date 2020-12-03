'use strict';

import {Record} from 'immutable';

var InitialState = Record({
    email: null,
    password: null,
    loggedIn : false,
    isLoggin : false,
    typeScan: 'checkin',


});

export default InitialState;
