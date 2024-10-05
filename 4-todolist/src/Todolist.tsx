import {FilterValuesType, TaskType} from "./App";
import {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button} from "./Button";

type PropsType = {
	title: string
	tasks: TaskType[]
	removeTask: (taskId: string) => void
	changeFilter: (filter: FilterValuesType) => void
	addTask: (title: string) => void
}

export const Todolist = ({title, tasks, removeTask, changeFilter, addTask}: PropsType) => {
	const [taskTitle, setTaskTitle] = useState('')

	const addTaskHandler = () => {
		addTask(taskTitle)
		setTaskTitle('')
	}

	const changeTaskTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setTaskTitle(event.currentTarget.value)
	}

	const addTaskOnKeyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			addTaskHandler()
		}
	}

	const changeFilterTasksHandler = (filter: FilterValuesType) => {
		changeFilter(filter)
	}

	return (
		<div>
			<h3>{title}</h3>
			<div>
				<input
					value={taskTitle}
					onChange={changeTaskTitleHandler}
					onKeyUp={addTaskOnKeyUpHandler}
				/>
				<Button title={'+'} onClick={addTaskHandler}/>
			</div>
			{
				tasks.length === 0
					? <p>Тасок нет</p>
					: <ul>
						{tasks.map((task) => {

							const removeTaskHandler = () => {
								removeTask(task.id)
							}

							return <li key={task.id}>
								<input type="checkbox" checked={task.isDone}/>
								<span>{task.title}</span>
								<Button onClick={removeTaskHandler} title={'x'}/>
							</li>
						})}
					</ul>
			}
			<div>
				<Button title={'All'} onClick={()=> changeFilterTasksHandler('all')}/>
				<Button title={'Active'} onClick={()=> changeFilterTasksHandler('active')}/>
				<Button title={'Completed'} onClick={()=> changeFilterTasksHandler('completed')}/>
			</div>
		</div>
	)
}
