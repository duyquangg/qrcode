'use strict';

import {Record} from 'immutable';

var InitialState = Record({
    email: null,
    password: null,
    loggedIn : false,
    isLoggin : false,
});

export default InitialState;
