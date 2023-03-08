import notificationSlice from './slices/notification';
import userSelectionSlice from './slices/userSelection';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    notification: notificationSlice,
    userSelection: userSelectionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
