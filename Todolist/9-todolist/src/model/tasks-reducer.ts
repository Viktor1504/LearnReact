import {TasksStateType} from '../App'
import {v1} from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType} from './todolists-reducer';

export const tasksReducer = (state: TasksStateType, {type, payload}: ActionsType): TasksStateType => {
    switch (type) {
        case 'REMOVE-TASK': {
            return {...state, [payload.todolistId]: state[payload.todolistId].filter(t => t.id !== payload.taskId)}
        }
        case 'ADD-TASK': {
            const newTask = {id: v1(), title: payload.title, isDone: false}
            return {...state, [payload.todolistId]: [newTask, ...state[payload.todolistId]]}
        }
        case 'CHANGE-STATUS-TASK': {
            return {
                ...state,
                [payload.todolistId]: state[payload.todolistId].map(t => t.id === payload.taskId ? {
                    ...t,
                    isDone: payload.isDone
                } : t)
            }
        }
        case 'CHANGE-TITLE-TASK': {
            return {
                ...state,
                [payload.todolistId]: state[payload.todolistId].map(t => t.id === payload.taskId ? {
                    ...t,
                    title: payload.title
                } : t)
            }
        }
        case 'ADD-TODOLIST': {
            return {...state, [payload.todolistId]: []}
        }
        case 'REMOVE-TODOLIST': {
            const {[payload.id]: _, ...newState} = state
            return newState
        }
        default:
            throw new Error('I don\'t understand this type')
    }
}

// Action creators
export const removeTaskAC = (payload: { taskId: string, todolistId: string }) => {
    return {type: 'REMOVE-TASK', payload} as const
}

export const addTaskAC = (payload: { title: string, todolistId: string }) => {
    return {type: 'ADD-TASK', payload} as const
}

export const changeTaskStatusAC = (payload: { taskId: string, todolistId: string, isDone: boolean }) => {
    return {type: 'CHANGE-STATUS-TASK', payload} as const
}

export const changeTaskTitleAC = (payload: { taskId: string, todolistId: string, title: string }) => {
    return {type: 'CHANGE-TITLE-TASK', payload} as const
}

// Actions types
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>


type ActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType