import {createSlice} from "@reduxjs/toolkit";

const initialHelperState = {
    showSideBar : false,
    showMenu : false
};

const helperSlice = createSlice({
    name:'helper',
    initialState:initialHelperState,
    reducers:{
        showSideBarHandler(state,action){
            console.log(action.payload)
            state.showSideBar = action.payload
        },
        showMenuHandler(state,action){
            if(!action.payload){
                state.showMenu = !state.showMenu
            }else{
                state.showMenu = action.payload
            }
        }
    }
})

export const helperActions = helperSlice.actions;
export default helperSlice.reducer;
