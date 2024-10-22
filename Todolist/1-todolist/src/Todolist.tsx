import {Button} from './Button';

export type TaskType = {
    id: number
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    title: string
    tasks: TaskType[]
}

export const Todolist = ({title, tasks}: TodolistPropsType) => {
    return (
        <div>
            <h3>{title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            {
                tasks.length === 0
                    ? <p>Тасок нет</p>
                    : <ul>
                        {
                            tasks.map((task: TaskType) =>
                                <li key={task.id}>
                                    <input type="checkbox" checked={task.isDone}/>
                                    <span>{task.title}</span>
                                </li>)
                        }
                    </ul>
            }
            <div>
                <Button title={'All'}/>
                <Button title={'Active'}/>
                <Button title={'Completed'}/>
            </div>
        </div>
    )
}