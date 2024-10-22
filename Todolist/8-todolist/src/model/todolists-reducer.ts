import {v1} from 'uuid'
import {FilterValuesType, TodolistType} from '../App';

let todolistID1 = v1()
let todolistID2 = v1()

const initialState: TodolistType[] = [
    {id: todolistID1, title: 'What to learn', filter: 'all'},
    {id: todolistID2, title: 'What to buy', filter: 'all'},
]

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    payload: {
        id: string
    }
}

export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    payload: {
        title: string
    }
}

export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    payload: {
        id: string
        title: string
    }
}

export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    payload: {
        id: string
        filter: FilterValuesType
    }
}

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType

export const todolistsReducer = (state: TodolistType[] = initialState, action: ActionsType) => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(todolist => todolist.id !== action.payload.id)
        }
        case 'ADD-TODOLIST': {
            return [...state, {id: v1(), title: action.payload.title, filter: 'all'}]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(todolist => todolist.id === action.payload.id ? {
                ...todolist,
                title: action.payload.title
            } : todolist)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(todolist => todolist.id === action.payload.id ? {
                ...todolist,
                filter: action.payload.filter
            } : todolist)
        }

        default:
            throw new Error('I don\'t understand this type')
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', payload: {id: todolistId}} as const
}

export const addTodolistAC = (title: string): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', payload: {title}} as const
}

export const changeTodolistTitle = (todolistId: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', payload: {id: todolistId, title}} as const
}

export const changeTodolistFilter = (todolistId: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', payload: {id: todolistId, filter}} as const
}