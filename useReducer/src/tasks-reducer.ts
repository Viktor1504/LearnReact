import {TaskType} from './App'
import {v1} from 'uuid';

export const tasksReducer = (state: TaskType[], {type, payload}: ActionsType): TaskType[] => {
    switch (type) {
        case 'REMOVE-TASK':
            return state.filter(task => task.id !== payload.taskId)
        case 'ADD_TASK' : {
            const newTask = {
                id: v1(),
                title: payload.title,
                isDone: false
            }
            return [newTask, ...state]
        }
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string): RemoveTaskActionType => ({
    type: 'REMOVE-TASK',
    payload: {taskId}
}) as const

export const addTaskAC = (title: string): AddTaskActionType => ({type: 'ADD_TASK', payload: {title}}) as const


type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    payload: {
        taskId: string
    }
}

type AddTaskActionType = {
    type: 'ADD_TASK',
    payload: {
        title: string
    }
}

type ActionsType = RemoveTaskActionType | AddTaskActionType