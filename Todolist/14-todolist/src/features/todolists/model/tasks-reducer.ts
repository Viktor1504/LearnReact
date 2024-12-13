import { AddTodolistActionType, RemoveTodolistActionType } from "./todolists-reducer"
import { Dispatch } from "redux"
import { tasksApi } from "../api/tasksApi"
import { TaskStatus } from "common/enums"
import { DomainTask, UpdateTaskDomainModel } from "../api/tasksApi.types"
import { RootState } from "../../../app/store"

export type TasksStateType = {
  [key: string]: DomainTask[]
}

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
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

    case "ADD-TODOLIST":
      return { ...state, [action.payload.todolist.id]: [] }

    case "REMOVE-TODOLIST": {
      let copyState = { ...state }
      delete copyState[action.payload.id]
      return copyState
    }

    case "SET-TASKS": {
      const stateCopy = { ...state }
      stateCopy[action.payload.todolistId] = action.payload.tasks
      return stateCopy
    }

    case "UPDATE-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map((t) =>
          t.id === action.payload.taskId ? { ...t, ...action.payload.model } : t,
        ),
      }
    }

    default:
      return state
  }
}

// Action creators
export const removeTaskAC = (payload: { taskId: string; todolistId: string }) => {
  return {
    type: "REMOVE-TASK",
    payload,
  } as const
}

export const addTaskAC = (payload: { task: DomainTask }) => {
  return {
    type: "ADD-TASK",
    payload,
  } as const
}

export const setTasksAC = (payload: { todolistId: string; tasks: DomainTask[] }) => {
  return {
    type: "SET-TASKS",
    payload,
  } as const
}

export const updateTaskAC = (payload: { taskId: string; todolistId: string; model: UpdateTaskDomainModel }) => {
  return {
    type: "UPDATE-TASK",
    payload,
  } as const
}

// Thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  tasksApi.getTasks(todolistId).then((res) => {
    const tasks = res.data.items
    dispatch(setTasksAC({ todolistId, tasks }))
  })
}

export const removeTaskTC = (arg: { taskId: string; todolistId: string }) => (dispatch: Dispatch) => {
  tasksApi.deleteTask(arg).then((res) => {
    dispatch(removeTaskAC(arg))
  })
}

export const addTaskTC = (arg: { title: string; todolistId: string }) => (dispatch: Dispatch) => {
  tasksApi.createTask(arg).then((res) => {
    dispatch(addTaskAC({ task: res.data.data.item }))
  })
}

export const updateTaskTC =
  (arg: { todolistId: string; taskId: string; domainModel: UpdateTaskDomainModel }) =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const { taskId, todolistId, domainModel } = arg

    const allTasksFromState = getState().tasks
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find((t) => t.id === taskId)

    if (task) {
      const model: UpdateTaskDomainModel = {
        ...task,
        title: domainModel.title ?? task.title, // обновляем только, если передан новый title
        status: domainModel.status ?? task.status,
      }
      tasksApi.updateTask({ taskId, todolistId, model }).then((res) => {
        dispatch(updateTaskAC({ taskId, todolistId, model }))
      })
    }
  }

// Actions types
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type SetTasksActionType = ReturnType<typeof setTasksAC>
export type UpdateTasksActionType = ReturnType<typeof updateTaskAC>

type ActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTasksActionType
  | UpdateTasksActionType
