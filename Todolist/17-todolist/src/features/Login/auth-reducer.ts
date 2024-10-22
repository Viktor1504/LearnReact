import { Dispatch } from "redux";
import { authAPI, LoginParamsType } from "../../api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SetAppErrorActionType, setAppStatus, SetAppStatusActionType } from "app/app-reducer";
import { clearDataState, ClearDataStateActionType } from "features/TodolistsList/todolists-reducer";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  } as InitialStateType,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const authReducer = slice.reducer;
export const { setIsLoggedIn } = slice.actions;

// thunks
export const loginTC =
  (data: LoginParamsType) => (dispatch: Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>) => {
    dispatch(setAppStatus({ status: "loading" }));
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedIn({ isLoggedIn: true }));
          dispatch(setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const logoutTC =
  () =>
  (dispatch: Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType | ClearDataStateActionType>) => {
    dispatch(setAppStatus({ status: "loading" }));
    authAPI
      .logout()
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedIn({ isLoggedIn: false }));
          dispatch(setAppStatus({ status: "succeeded" }));
          dispatch(clearDataState());
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };

// types

type ActionsType = ReturnType<typeof setIsLoggedIn>;
type InitialStateType = {
  isLoggedIn: boolean;
};
