import { tasksReducer } from "features/TodolistsList/tasks.reducer";
import { todolistsReducer } from "features/TodolistsList/todolists.reducer";
import { appReducer } from "app/initializeAppTC";
import { authReducer } from "features/auth/auth.reducer";
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
});

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
