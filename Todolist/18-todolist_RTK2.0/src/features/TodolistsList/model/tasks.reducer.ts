import {
  AddTaskArgs,
  RemoveTaskArg,
  TaskType,
  todolistsAPI,
  UpdateTaskArgs,
  UpdateTaskModelType,
} from '../api/todolists-api'
import { appActions } from '../../../app/app.reducer'
import { todolistsActions } from './todolists.reducer'
import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit'
import { handleServerAppError, handleServerNetworkError } from 'common/utils'
import { clearTasksAndTodolists } from 'common/actions/common.actions'
import { ResultCode, TaskPriorities, TaskStatuses } from 'common/enums'
import { AppDispatch, AppRootStateType } from '../../../app/store'

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
})

const slice = createAppSlice({
  name: 'tasks',
  initialState: {} as TasksStateType,
  reducers: (creators) => {
    const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null }>()
    return {
      fetchTasks: createAThunk<string, { todolistId: string; tasks: TaskType[] }>(
        async (todolistId, { dispatch, rejectWithValue }) => {
          const appDispatch = dispatch as AppDispatch
          try {
            appDispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.getTasks(todolistId)
            const tasks = res.data.items
            appDispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { tasks, todolistId }
          } catch (error) {
            handleServerNetworkError(error, appDispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
          },
        }
      ),
      addTask: createAThunk<AddTaskArgs, { task: TaskType }>(
        async (arg, { dispatch, rejectWithValue }) => {
          const appDispatch = dispatch as AppDispatch
          try {
            appDispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.createTask(arg)
            if (res.data.resultCode === ResultCode.Success) {
              const task = res.data.data.item
              appDispatch(appActions.setAppStatus({ status: 'succeeded' }))
              return { task }
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
            const tasks = state[action.payload.task.todoListId]
            tasks.unshift(action.payload.task)
          },
        }
      ),
      updateTask: createAThunk<UpdateTaskArgs, UpdateTaskArgs>(
        async (arg, { dispatch, rejectWithValue, getState }) => {
          const appDispatch = dispatch as AppDispatch
          const tasks = (getState() as AppRootStateType).tasks
          try {
            const task = tasks[arg.todolistId].find((t) => t.id === arg.taskId)
            if (!task) {
              console.warn('task not found in the state')
              return rejectWithValue(null)
            }

            const apiModel: UpdateTaskModelType = {
              deadline: task.deadline,
              description: task.description,
              priority: task.priority,
              startDate: task.startDate,
              title: task.title,
              status: task.status,
              ...arg.model,
            }

            const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
            if (res.data.resultCode === ResultCode.Success) {
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
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((t) => t.id === action.payload.taskId)
            if (index !== -1) {
              tasks[index] = { ...tasks[index], ...action.payload.model }
            }
          },
        }
      ),
      removeTask: createAThunk<RemoveTaskArg, RemoveTaskArg>(
        async (arg, { dispatch, rejectWithValue }) => {
          const appDispatch = dispatch as AppDispatch
          try {
            const res = await todolistsAPI.deleteTask(arg)
            if (res.data.resultCode === ResultCode.Success) {
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
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((t) => t.id === action.payload.taskId)
            if (index !== -1) {
              tasks.splice(index, 1)
            }
          },
        }
      ),
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsActions.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(todolistsActions.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsActions.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(clearTasksAndTodolists, () => {
        return {}
      })
  },
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}
