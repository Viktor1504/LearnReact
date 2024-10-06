import {ChangeEvent, useState} from 'react';

type EditableSpanType = {
    value: string
    onChange: (newTitle: string) => void
}

export const EditableSpan = ({value, onChange}: EditableSpanType) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState(value)

    const activateEditModeHandler = () => {
        setEditMode(!editMode)
    }

    const deactivateEditModeHandler = () => {
        setEditMode(!editMode)
        onChange(title)
    }

    const changeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return (
        <>
            {
                editMode
                    ? <input value={title}
                             autoFocus
                             onChange={changeTitleHandler}
                             onBlur={deactivateEditModeHandler}/>
                    : <span onDoubleClick={activateEditModeHandler}>{value}</span>
            }
        </>
    )


}

