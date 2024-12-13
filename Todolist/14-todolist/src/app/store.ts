import { combineReducers, UnknownAction } from "redux"
import { tasksReducer } from "../features/todolists/model/tasks-reducer"
import { todolistsReducer } from "../features/todolists/model/todolists-reducer"
import { appReducer } from "./app-reducer"
import { ThunkDispatch } from "redux-thunk"
import { configureStore } from "@reduxjs/toolkit"

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>

// export type AppDispatch = typeof store.dispatch
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>

// @ts-ignore
window.store = store
