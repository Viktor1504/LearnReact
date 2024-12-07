import { AddItemForm } from "common/components"
import { useAppDispatch } from "common/hooks"
import { addTaskTC } from "../../../model/tasksSlice"
import { DomainTodolist } from "../../../model/todolistsSlice"

import { FilterTasksButtons } from "./FilterTasksButtons/FilterTasksButtons"
import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import { useCreateTaskMutation } from "../../../api/_tasksApi"

type Props = {
  todolist: DomainTodolist
}

export const Todolist = ({ todolist }: Props) => {
  const [createTask] = useCreateTaskMutation()

  const addTaskCallback = (title: string) => {
    createTask({ todolistId: todolist.id, title })
  }

  return (
    <>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />
      <Tasks todolist={todolist} />
      <FilterTasksButtons todolist={todolist} />
    </>
  )
}
