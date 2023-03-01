import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    addNotification: (state, action) => {
      const { payload }: { payload: string } = action;
      state = payload;
      return state;
    },
    removeNotification: (state, action) => {
      const { payload }: { payload: string } = action;
      state = payload;
      return state;
    },
  },
});

export default notificationSlice.reducer;
