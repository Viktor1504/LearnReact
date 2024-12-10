import List from "@mui/material/List"
import { TaskStatus } from "common/enums"
import { useGetTasksQuery } from "../../../../api/tasksApi"
import { Task } from "./Task/Task"
import { TasksSkeleton } from "../../../skeletons/TasksSkeleton/TasksSkeleton"
import { TasksPagination } from "../TasksPagination/TasksPagination"
import { useState } from "react"
import { DomainTodolist } from "../../../../lib/types/types"

type Props = {
  todolist: DomainTodolist
}

type ErrorData = {
  status: number
  data: {
    message: string
  }
}

export const Tasks = ({ todolist }: Props) => {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetTasksQuery({ todolistId: todolist.id, args: { page } })

  let tasks = data?.items

  if (todolist.filter === "active") {
    tasks = tasks?.filter((task) => task.status === TaskStatus.New)
  }

  if (todolist.filter === "completed") {
    tasks = tasks?.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {!tasks || tasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
          <List>
            {tasks.map((task) => {
              return <Task key={task.id} task={task} todolist={todolist} />
            })}
          </List>
          <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={setPage} />
        </>
      )}
    </>
  )
}
