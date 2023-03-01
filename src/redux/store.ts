import notificationSlice from './slices/notification';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    notification: notificationSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
