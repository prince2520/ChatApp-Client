import {createSlice} from "@reduxjs/toolkit";

const initialGroupState = {
    group:[],
    highlightedGroupId:'',
    selectedGroup:{},
    isGroupSelected:false
};

const groupSlice = createSlice({
    name:'group',
    initialState:initialGroupState,
    reducers:{
        groups(state,action){
            if(action.payload.removeGroup){
                state.group = []
            }else{
                state.group.push({
                    _id:action.payload._id,
                    groupName:action.payload.groupName,
                    lastMessage:action.payload.lastMessage,
                    groupImageUrl:action.payload.groupImageUrl
                });
            }
        },
        highlightedGroup(state,action){
            state.highlightedGroupId = action.payload._id
        },
        selectedGroupData(state,action){
            state.selectedGroup = action.payload
        },
        isGroupSelect(state,action){
            state.isGroupSelected = action.payload
        },
        removeSelectedGroup(state){
          console.log('SelectedGroupRemove')
          state.selectedGroup = {};
        }
    }
})

export const groupActions = groupSlice.actions;
export default groupSlice.reducer;
