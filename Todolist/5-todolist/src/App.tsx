import './App.css';
import {Todolist} from './Todolist';
import {useState} from 'react';
import {v1} from 'uuid';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TasksStateType = {
    [key: string]: TaskType[]
}

type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type FilterValuesType = 'all' | 'active' | 'completed'

function App() {
    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, setTodolists] = useState<TodolistType[]>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: false},
        ],
    })

    const removeTask = (taskId: string, todolistId: string) => {
        const newTodolistTasks = {...tasks, [todolistId]: tasks[todolistId].filter(task => task.id !== taskId)}
        setTasks(newTodolistTasks)
    }

    const addTask = (title: string, todolistId: string) => {
        const newTask = {
            id: v1(),
            title: title,
            isDone: false
        }
        const newTasks = {...tasks, [todolistId]: [newTask, ...tasks[todolistId]]}
        setTasks(newTasks)
    }

    const changeFilter = (filter: FilterValuesType, todolistId: string) => {
        setTodolists(todolists.map(tl => (tl.id === todolistId ? {...tl, filter} : tl)))
    }

    const changeTaskStatus = (taskId: string, todolistId: string, taskStatus: boolean) => {
        const newTasks = {
            ...tasks, [todolistId]: tasks[todolistId].map(task => task.id === taskId
                ? {...task, isDone: taskStatus} : task)
        }
        setTasks(newTasks)
    }

    const removeTodolist = (todolistId: string) => {
        const newTodolists = todolists.filter(todolist => todolist.id !== todolistId)
        setTodolists(newTodolists)
        delete tasks[todolistId]
        setTasks({...tasks})
    }

    return (
        <div className="App">
            {todolists.map(tl => {
                const allTodolistTasks = tasks[tl.id]
                let tasksForTodolist = allTodolistTasks

                if (tl.filter === 'active') {
                    tasksForTodolist = allTodolistTasks.filter(task => !task.isDone)
                }

                if (tl.filter === 'completed') {
                    tasksForTodolist = allTodolistTasks.filter(task => task.isDone)
                }
                return (
                    <Todolist
                        key={tl.id}
                        todolistId={tl.id}
                        title={tl.title}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        filter={tl.filter}
                        removeTodolist={removeTodolist}
                    />
                )
            })}
        </div>
    );
}

export default App;
