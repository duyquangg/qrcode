'use strict';

import global from './global/globalReducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    global,
});

export default rootReducer;