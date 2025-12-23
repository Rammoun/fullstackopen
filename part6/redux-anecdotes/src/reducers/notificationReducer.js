import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'Initial Notification Message', // Set a string to test 6.12
  reducers: {
    setNotificationMessage(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return ''
    }
  }
})

export const { setNotificationMessage, clearNotification } = notificationSlice.actions

let timeoutId = null
export const setNotification = (message, timeInSeconds) => {
  return async (dispatch) => {
    dispatch(setNotificationMessage(message))
    
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, timeInSeconds * 1000)
  }
}

export default notificationSlice.reducer