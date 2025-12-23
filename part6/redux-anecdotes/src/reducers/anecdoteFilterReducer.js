import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '', 
  reducers: {
    filterReducer(state, action){
      return action.payload.toLowerCase()
    }
  }
})

export const {filterReducer} = filterSlice.actions
export default filterSlice.reducer