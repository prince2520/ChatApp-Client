import {configureStore} from "@reduxjs/toolkit";

import groupReducer from "./group";
import privateUserReducer from './private-user';
import groupChatReducer from './group-message';
import privateChatReducer from './private-user-message';
import helperReducer from './helper-redux';

const store = configureStore({
    reducer: {
        group: groupReducer,
        privateUser:privateUserReducer,
        groupChat:groupChatReducer,
        privateChat:privateChatReducer,
        helper: helperReducer
    }
});

export default store;
