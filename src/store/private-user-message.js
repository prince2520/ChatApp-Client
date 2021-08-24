import {createSlice} from "@reduxjs/toolkit";

const initialGroupState = {
    privateMessage:[],
    sendMessage: '',
    showEmoji:false,
};

const privateChatSlice = createSlice({
    name:'privateChat',
    initialState:initialGroupState,
    reducers:{
        privateMessage(state,action){
            if(action.payload.prevStateDependent){
                state.privateMessage.push({
                    userName:action.payload.userName,
                    message: action.payload.message
                });
            }
            else {
                state.privateMessage = []
            }
        },
        sendMessageHandler(state,action){
            state.sendMessage = action.payload.message
        },
        showEmojiHandler(state){
            console.log(state.showEmoji)
            state.showEmoji = !state.showEmoji
        }

    }
})

export const privateChatActions = privateChatSlice.actions;
export default privateChatSlice.reducer;
