import { Dispatch } from "redux"
import { RootState } from "../../../app/store"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskDomainModel, UpdateTaskModel } from "../api/tasksApi.types"
import { AddTodolistActionType, RemoveTodolistActionType } from "./todolists-reducer"
import { setAppStatusAC } from "../../../app/app-reducer"
import { ResultCode } from "common/enums"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"

export type TasksStateType = {
  [key: string]: DomainTask[]
}

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case "SET-TASKS": {
      const stateCopy = { ...state }
      stateCopy[action.payload.todolistId] = action.payload.tasks
      return stateCopy
    }

    case "REMOVE-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter((t) => t.id !== action.payload.taskId),
      }
    }

    case "ADD-TASK": {
      const newTask = action.payload.task
      return { ...state, [newTask.todoListId]: [newTask, ...state[newTask.todoListId]] }
    }

    case "UPDATE-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map((t) =>
          t.id === action.payload.taskId
            ? {
                ...t,
                ...action.payload.domainModel,
              }
            : t,
        ),
      }
    }

    case "ADD-TODOLIST":
      return { ...state, [action.payload.todolist.id]: [] }

    case "REMOVE-TODOLIST": {
      let copyState = { ...state }
      delete copyState[action.payload.id]
      return copyState
    }

    default:
      return state
  }
}

// Action creators
export const setTasksAC = (payload: { todolistId: string; tasks: DomainTask[] }) => {
  return {
    type: "SET-TASKS",
    payload,
  } as const
}

export const removeTaskAC = (payload: { taskId: string; todolistId: string }) => {
  return {
    type: "REMOVE-TASK",
    payload,
  } as const
}

export const addTaskAC = (payload: { task: DomainTask }) => {
  return { type: "ADD-TASK", payload } as const
}

export const updateTaskAC = (payload: { taskId: string; todolistId: string; domainModel: UpdateTaskDomainModel }) => {
  return {
    type: "UPDATE-TASK",
    payload,
  } as const
}

// Actions types
export type SetTasksActionType = ReturnType<typeof setTasksAC>
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>

// Thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"))
  tasksApi
    .getTasks(todolistId)
    .then((res) => {
      const tasks = res.data.items
      dispatch(setTasksAC({ todolistId, tasks }))
      dispatch(setAppStatusAC("succeeded"))
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
      dispatch(setAppStatusAC("failed"))
    })
}

export const removeTaskTC = (arg: { taskId: string; todolistId: string }) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"))
  tasksApi
    .deleteTask(arg)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(removeTaskAC(arg))
        dispatch(setAppStatusAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
        dispatch(setAppStatusAC("failed"))
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
      dispatch(setAppStatusAC("failed"))
    })
}

export const addTaskTC = (arg: { title: string; todolistId: string }) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"))
  tasksApi
    .createTask(arg)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(addTaskAC({ task: res.data.data.item }))
        dispatch(setAppStatusAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
        dispatch(setAppStatusAC("failed"))
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
      dispatch(setAppStatusAC("failed"))
    })
}

export const updateTaskTC =
  (arg: { taskId: string; todolistId: string; domainModel: UpdateTaskDomainModel }) =>
  (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setAppStatusAC("loading"))

    const { taskId, todolistId, domainModel } = arg
    const allTasksFromState = getState().tasks
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find((t) => t.id === taskId)

    if (task) {
      const model: UpdateTaskModel = {
        status: task.status,
        title: task.title,
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        ...domainModel,
      }
      tasksApi
        .updateTask({ taskId, todolistId, model })
        .then((res) => {
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(updateTaskAC(arg))
            dispatch(setAppStatusAC("succeeded"))
          } else {
            handleServerAppError(res.data, dispatch)
            dispatch(setAppStatusAC("failed"))
          }
        })
        .catch((error) => {
          handleServerNetworkError(error, dispatch)
          dispatch(setAppStatusAC("failed"))
        })
    }
  }

type ActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | UpdateTaskActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTasksActionType
