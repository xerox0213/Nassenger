import { createSlice } from '@reduxjs/toolkit';

type Action = {
  type: string;
  payload: string;
};

type State = string[];

const initialState: State = [];

const userSelectionSlice = createSlice({
  name: 'userSelection',
  initialState,
  reducers: {
    addUser: (state, action: Action) => {
      const uid = action.payload;
      state.push(uid);
      return state;
    },

    removeUser: (state, action: Action) => {
      const uid = action.payload;
      state = state.filter((elem) => elem !== uid);
      return state;
    },

    emptyUserSelection: (state) => {
      state = [];
      return state;
    },
  },
});

export default userSelectionSlice.reducer;
