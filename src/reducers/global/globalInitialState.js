'use strict';

import {Record} from 'immutable';

var InitialState = Record({
    email: '',
    password: '',
    loggedIn : false,
    isLoggin : false,
});

export default InitialState;
