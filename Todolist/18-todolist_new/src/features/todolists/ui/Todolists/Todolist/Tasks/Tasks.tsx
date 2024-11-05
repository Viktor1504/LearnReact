import List from "@mui/material/List"
import { TaskStatus } from "common/enums"
import { DomainTodolist, FilterValuesType } from "../../../../model/todolistsSlice"
import { Task } from "./Task/Task"
import { useGetTasksQuery } from "../../../../api/_tasksApi"
import { DomainTask } from "../../../../api/tasksApi.types"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { data } = useGetTasksQuery(todolist.id)
  const tasks = data?.items || []

  const filterTasks = (tasks: DomainTask[], filter: FilterValuesType): DomainTask[] => {
    switch (filter) {
      case "active": {
        return tasks.filter((task) => task.status === TaskStatus.New)
      }
      case "completed": {
        return tasks.filter((task) => task.status === TaskStatus.Completed)
      }
      default: {
        return tasks
      }
    }
  }

  const tasksForTodolist = filterTasks(tasks, todolist.filter)

  return (
    <>
      {tasksForTodolist.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {tasksForTodolist.map((task) => {
            return <Task key={task.id} task={task} todolist={todolist} />
          })}
        </List>
      )}
    </>
  )
}
