import { todolistsAPI, TodolistType, UpdateTodolistType } from '../api/todolists-api'
import { appActions, RequestStatusType } from '../../../app/app.reducer'
import { asyncThunkCreator, buildCreateSlice, PayloadAction } from '@reduxjs/toolkit'
import { handleServerAppError, handleServerNetworkError } from 'common/utils'
import { ResultCode } from 'common/enums'
import { AppDispatch } from '../../../app/store'
import { clearTasksAndTodolists } from 'common/actions/common.actions'

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
})

const slice = createAppSlice({
  name: 'todo',
  initialState: [] as TodolistDomainType[],
  reducers: (creators) => {
    const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null }>()
    return {
      changeTodolistFilter: creators.reducer(
        (
          state,
          action: PayloadAction<{
            id: string
            filter: FilterValuesType
          }>
        ) => {
          const todo = state.find((todo) => todo.id === action.payload.id)
          if (todo) {
            todo.filter = action.payload.filter
          }
        }
      ),
      changeTodolistEntityStatus: creators.reducer(
        (
          state,
          action: PayloadAction<{
            todolistId: string
            entityStatus: RequestStatusType
          }>
        ) => {
          const todo = state.find((todo) => todo.id === action.payload.todolistId)
          if (todo) {
            todo.entityStatus = action.payload.entityStatus
          }
        }
      ),
      fetchTodolists: createAThunk<void, { todolists: TodolistType[] }>(
        async (_, { dispatch, rejectWithValue }) => {
          const appDispatch = dispatch as AppDispatch
          try {
            appDispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.getTodolists()
            appDispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { todolists: res.data }
          } catch (error) {
            handleServerNetworkError(error, appDispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            return action.payload.todolists.map((tl) => ({
              ...tl,
              filter: 'all',
              entityStatus: 'idle',
            }))
          },
        }
      ),
      removeTodolist: createAThunk<string, { todolistId: string }>(
        async (todolistId, { dispatch, rejectWithValue }) => {
          const appDispatch = dispatch as AppDispatch
          try {
            appDispatch(appActions.setAppStatus({ status: 'loading' }))
            appDispatch(
              todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'loading' })
            )
            const res = await todolistsAPI.deleteTodolist(todolistId)
            if (res.data.resultCode === ResultCode.Success) {
              appDispatch(appActions.setAppStatus({ status: 'succeeded' }))
              return { todolistId }
            } else {
              handleServerAppError(res.data, appDispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, appDispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
            if (index !== -1) {
              state.splice(index, 1)
            }
          },
        }
      ),
      addTodolist: createAThunk<string, { todolist: TodolistType }>(
        async (title, { dispatch, rejectWithValue }) => {
          const appDispatch = dispatch as AppDispatch
          try {
            appDispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.createTodolist(title)
            if (res.data.resultCode === ResultCode.Success) {
              appDispatch(appActions.setAppStatus({ status: 'succeeded' }))
              return { todolist: res.data.data.item }
            } else {
              handleServerAppError(res.data, appDispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, appDispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            const newTodolist: TodolistDomainType = {
              ...action.payload.todolist,
              filter: 'all',
              entityStatus: 'idle',
            }
            state.unshift(newTodolist)
          },
        }
      ),
      changeTodolistTitle: createAThunk<UpdateTodolistType, UpdateTodolistType>(
        async (arg, { dispatch, rejectWithValue }) => {
          const appDispatch = dispatch as AppDispatch
          try {
            appDispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.updateTodolist(arg)
            if (res.data.resultCode === ResultCode.Success) {
              appDispatch(appActions.setAppStatus({ status: 'succeeded' }))
              return arg
            } else {
              handleServerAppError(res.data, appDispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, appDispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            const todo = state.find((todo) => todo.id === action.payload.todolistId)
            if (todo) {
              todo.title = action.payload.title
            }
          },
        }
      ),
    }
  },
  extraReducers: (builder) => {
    builder.addCase(clearTasksAndTodolists, () => {
      return []
    })
  },
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

// types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
