import {AddItemForm} from '../../../../common/components/AddItemForm';
import {TodolistType} from '../../model/todolists-reducer';
import {addTaskAC} from '../../model/tasks-reducer';
import {TodolistTitle} from './TodolistTitle/TodolistTitle';
import {FilterTasksButtons} from './FilterTasksButtons/FilterTasksButtons';
import {Tasks} from './Tasks/Tasks';
import {useAppDispatch} from '../../../../common/hooks/useAppDispatch';

type Props = {
    todolist: TodolistType
}

export const Todolist = ({todolist}: Props) => {
    const dispatch = useAppDispatch()

    const addTaskCallback = (title: string) => {
        dispatch(addTaskAC({title, todolistId: todolist.id}))
    }

    return (
        <>
            <TodolistTitle todolist={todolist}/>
            <AddItemForm addItem={addTaskCallback}/>
            <Tasks todolist={todolist}/>
            <FilterTasksButtons todolist={todolist}/>
        </>
    )
}