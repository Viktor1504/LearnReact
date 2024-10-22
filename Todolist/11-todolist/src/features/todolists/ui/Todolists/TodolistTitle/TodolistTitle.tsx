import {EditableSpan} from '../../../../../common/components/EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {changeTodolistTitleAC, removeTodolistAC, TodolistType} from '../../../model/todolists-reducer';
import styles from './TodolistTitle.module.css'
import {useAppDispatch} from '../../../../../common/hooks/useAppDispatch';

type Props = {
    todolist: TodolistType
}

export const TodolistTitle = ({todolist}: Props) => {
    const {title, id} = todolist

    const dispatch = useAppDispatch()

    const removeTodolistHandler = () => {
        dispatch(removeTodolistAC(id))
    }
    const updateTodolistHandler = (title: string) => {
        dispatch(changeTodolistTitleAC({id, title}))
    }

    return (
        <div className={styles.container}>
            <h3>
                <EditableSpan value={title} onChange={updateTodolistHandler}/>
            </h3>
            <IconButton onClick={removeTodolistHandler}>
                <DeleteIcon/>
            </IconButton>
        </div>
    )
}

