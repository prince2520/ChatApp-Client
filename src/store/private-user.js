import {createSlice} from "@reduxjs/toolkit";

const initialPrivateUserState = {
    privateUsers:[],
    highlightedPrivateUserId:'',
    selectedPrivateUser:{},
    isPrivateUserSelected:false
};

const privateUserSlice = createSlice({
    name:'privateUser',
    initialState:initialPrivateUserState,
    reducers:{
        privateUser(state,action){
            if(action.payload.removePrivateUser){
                state.privateUsers = []
            }else {
                state.privateUsers.push({
                    _id:action.payload._id,
                    privateUserId:action.payload.privateUserId,
                    privateUsername:action.payload.privateUsername,
                    lastMessage:action.payload.lastMessage,
                    privateUserImageUrl:action.payload.privateUserImageUrl
                });
            }
        },
        highlightedPrivateUser(state,action){
            state.highlightedPrivateUserId = action.payload._id
        },
        selectPrivateUser(state,action){
            state.selectedPrivateUser = action.payload
        },
        isPrivateUserSelect(state,action){
            state.isPrivateUserSelected = action.payload
        },
        removeSelectedPrivateUser(state){
            state.selectedPrivateUser = {}
        }
    }
})

export const privateUserActions = privateUserSlice.actions;
export default privateUserSlice.reducer;
