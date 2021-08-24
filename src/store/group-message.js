import {createSlice} from "@reduxjs/toolkit";

const initialGroupState = {
    groupMessage:[],
    sendMessage: '',
    showEmoji:false,

};

const groupChatSlice = createSlice({
    name:'groupChat',
    initialState:initialGroupState,
    reducers:{
        groupMessage(state,action){
            if(action.payload.prevStateDependent){
                state.groupMessage.push({
                    userName:action.payload.userName,
                    message: action.payload.message,
                    userEmail: action.payload.userEmail,
                    month:action.payload.month,
                    date:action.payload.date,
                    year :action.payload.year,
                    time:action.payload.time
                });
            }
            else {
                state.groupMessage = []
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

export const groupChatActions = groupChatSlice.actions;
export default groupChatSlice.reducer;
