import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string | null;
}

const initialState: AuthState = {
  username: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    clearUsername: (state) => {
      state.username = null;
    },
  },
});

export const { setUsername, clearUsername } = authSlice.actions;

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
