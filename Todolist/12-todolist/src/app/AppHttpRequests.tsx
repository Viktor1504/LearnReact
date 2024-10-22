import Checkbox from '@mui/material/Checkbox'
import React, {ChangeEvent, useEffect, useState} from 'react'
import {AddItemForm} from '../common/components/AddItemForm/AddItemForm'
import {EditableSpan} from '../common/components/EditableSpan/EditableSpan'
import axios from 'axios';

export type Todolist = {
    id: string
    title: string
    addedDate: string
    order: number
}

type FieldError = {
    error: string
    field: string
}

type CreateTodolistResponse = {
    resultCode: number
    messages: string[]
    fieldsErrors: FieldError[]
    data: {
        item: Todolist
    }
}

export type DeleteTodolistResponse = {
    data: {};
    messages: string[];
    fieldsErrors: FieldError[];
    resultCode: number;
}

export type UpdateTodolistResponse = {
    data: {};
    messages: string[];
    fieldsErrors: FieldError[];
    resultCode: number;
}

export type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: DomainTask[]
}

export type DomainTask = {
    addedDate: string
    deadline: string
    description: string
    id: string
    order: number
    priority: number
    startDate: string
    status: number
    title: string
    todoListId: string
}

export type CreateTaskResponse = {
    data: {
        item: DomainTask
    }
    messages: string[];
    fieldsErrors: FieldError[];
    resultCode: number;
}

type UpdateTaskModel = {
    status: number
    title: string
    deadline: string
    description: string
    priority: number
    startDate: string
}

type UpdateTaskResponse = {
    data: {
        item: DomainTask
    }
    messages: string[];
    fieldsErrors: FieldError[];
    resultCode: number;
}

type DeleteTaskResponse = {
    data: {}
    messages: string[];
    fieldsErrors: FieldError[];
    resultCode: number;
}

export const AppHttpRequests = () => {
    const [todolists, setTodolists] = useState<Todolist[]>([])
    const [tasks, setTasks] = useState<{ [key: string]: DomainTask[] }>({})

    useEffect(() => {
        axios.get<Todolist[]>('https://social-network.samuraijs.com/api/1.1/todo-lists', {
            headers: {
                Authorization: `Bearer e0a6d13c-2e26-4b57-88f5-a909853b940d`
            },
        })
            .then(res => {
                const todolists = res.data
                setTodolists(todolists)
                todolists.forEach(tl => {
                    axios
                        .get<GetTasksResponse>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${tl.id}/tasks`, {
                            headers: {
                                Authorization: 'Bearer e0a6d13c-2e26-4b57-88f5-a909853b940d',
                                'API-KEY': '5d2e37f1-395e-4105-b8eb-f1ffe52ce33f'
                            }
                        })
                        .then(res => {
                            const tasksForTodolist = res.data.items;
                            setTasks(prevTasks => ({
                                ...prevTasks, [tl.id]: tasksForTodolist
                            }));
                        })
                })
            })
    }, [])

    const createTodolistHandler = (title: string) => {
        axios
            .post<CreateTodolistResponse>(
                'https://social-network.samuraijs.com/api/1.1/todo-lists',
                {title},
                {
                    headers: {
                        Authorization: 'Bearer e0a6d13c-2e26-4b57-88f5-a909853b940d',
                        'API-KEY': '5d2e37f1-395e-4105-b8eb-f1ffe52ce33f'
                    }
                }
            )
            .then(res => {
                const newTodolist = res.data.data.item
                setTodolists([newTodolist, ...todolists])
                setTasks({...tasks, [newTodolist.id]: []})
            })
    }

    const removeTodolistHandler = (id: string) => {
        axios
            .delete<DeleteTodolistResponse>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${id}`, {
                headers: {
                    Authorization: 'Bearer e0a6d13c-2e26-4b57-88f5-a909853b940d',
                    'API-KEY': '5d2e37f1-395e-4105-b8eb-f1ffe52ce33f'
                }
            })
            .then(res => {
                setTodolists(todolists.filter(tl => tl.id !== id))
            })
    }

    const updateTodolistHandler = (id: string, title: string) => {
        axios
            .put<UpdateTodolistResponse>(
                `https://social-network.samuraijs.com/api/1.1/todo-lists/${id}`,
                {title},
                {
                    headers: {
                        Authorization: 'Bearer e0a6d13c-2e26-4b57-88f5-a909853b940d',
                        'API-KEY': '5d2e37f1-395e-4105-b8eb-f1ffe52ce33f'
                    }
                }
            )
            .then(res => {
                setTodolists(todolists.map(tl => tl.id === id ? {...tl, title} : tl))
            })
    }

    const createTaskHandler = (title: string, todolistId: string) => {
        axios
            .post<CreateTaskResponse>(
                `https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks`,
                {title},
                {
                    headers: {
                        Authorization: 'Bearer e0a6d13c-2e26-4b57-88f5-a909853b940d',
                        'API-KEY': '5d2e37f1-395e-4105-b8eb-f1ffe52ce33f'
                    }
                }
            )
            .then(res => {
                const newTask = res.data.data.item
                setTasks(prevTasks => ({
                    ...prevTasks,
                    [todolistId]: prevTasks[todolistId] ? [newTask, ...prevTasks[todolistId]] : [newTask]
                }))
            })
    }

    const removeTaskHandler = (taskId: string, todolistId: string) => {
        axios
            .delete<DeleteTaskResponse>(
                `https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks/${taskId}`,
                {
                    headers: {
                        Authorization: 'Bearer e0a6d13c-2e26-4b57-88f5-a909853b940d',
                        'API-KEY': '5d2e37f1-395e-4105-b8eb-f1ffe52ce33f'
                    }
                }
            )
            .then(res => {
                console.log(res.data)
                setTasks({...tasks, [todolistId]: tasks[todolistId].filter(t => t.id !== taskId)})
            })
    }

    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>, task: DomainTask) => {
        let status = e.currentTarget.checked ? 2 : 0

        const model: UpdateTaskModel = {
            status,
            title: task.title,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate
        }

        axios
            .put<UpdateTaskResponse>(
                `https://social-network.samuraijs.com/api/1.1/todo-lists/${task.todoListId}/tasks/${task.id}`,
                model,
                {
                    headers: {
                        Authorization: 'Bearer e0a6d13c-2e26-4b57-88f5-a909853b940d',
                        'API-KEY': '5d2e37f1-395e-4105-b8eb-f1ffe52ce33f'
                    }
                }
            )
            .then(res => {
                const newTasks = tasks[task.todoListId].map(t => t.id === task.id ? {...t, ...model} : t)
                setTasks({...tasks, [task.todoListId]: newTasks})
            })
    }

    const changeTaskTitleHandler = (title: string, task: any) => {

        const model: UpdateTaskModel = {
            status: task.status,
            title,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate
        }

        axios
            .put<UpdateTaskResponse>(
                `https://social-network.samuraijs.com/api/1.1/todo-lists/${task.todoListId}/tasks/${task.id}`,
                model,
                {
                    headers: {
                        Authorization: 'Bearer e0a6d13c-2e26-4b57-88f5-a909853b940d',
                        'API-KEY': '5d2e37f1-395e-4105-b8eb-f1ffe52ce33f'
                    }
                }
            )
            .then(res => {
                const newTasks = tasks[task.todoListId].map(t => t.id === task.id ? {...t, ...model} : t)
                setTasks({...tasks, [task.todoListId]: newTasks})
            })
    }

    return (
        <div style={{margin: '20px'}}>
            <AddItemForm addItem={createTodolistHandler}/>
            {/* Todolists */}
            {todolists.map((tl) => {
                return (
                    <div key={tl.id} style={todolist}>
                        <div>
                            <EditableSpan
                                value={tl.title}
                                onChange={(title: string) => updateTodolistHandler(tl.id, title)}
                            />
                            <button onClick={() => removeTodolistHandler(tl.id)}>x</button>
                        </div>
                        <AddItemForm addItem={title => createTaskHandler(title, tl.id)}/>

                        {/* Tasks */}
                        {!!tasks[tl.id] &&
                            tasks[tl.id].map((task: DomainTask) => {
                                return (
                                    <div key={task.id}>
                                        <Checkbox
                                            checked={task.status === 2 ? true : false}
                                            onChange={e => changeTaskStatusHandler(e, task)}
                                        />
                                        <EditableSpan
                                            value={task.title}
                                            onChange={title => changeTaskTitleHandler(title, task)}
                                        />
                                        <button onClick={() => removeTaskHandler(task.id, tl.id)}>x</button>
                                    </div>
                                )
                            })}
                    </div>
                )
            })}
        </div>
    )
}

// Styles
const todolist: React.CSSProperties = {
    border: '1px solid black',
    margin: '20px 0',
    padding: '10px',
    width: '300px',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
}