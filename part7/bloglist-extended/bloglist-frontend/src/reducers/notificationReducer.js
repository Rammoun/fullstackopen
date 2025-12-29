import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return null
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const setNotificationWithTimeout = (message, type, timeInSeconds) => {
  return async dispatch => {
    dispatch(setNotification({message, type}))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeInSeconds * 1000)
  }
}

export default notificationSlice.reducer