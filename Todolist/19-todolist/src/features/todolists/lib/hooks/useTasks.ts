import { useState } from "react"
import { useGetTasksQuery } from "../../api/tasksApi"
import { TaskStatus } from "common/enums"
import { DomainTodolist } from "../types/types"

export const useTasks = (todolist: DomainTodolist) => {
  const { id, filter } = todolist
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetTasksQuery({ todolistId: id, args: { page } })

  let tasks = data?.items

  if (filter === "active") {
    tasks = tasks?.filter((task) => task.status === TaskStatus.New)
  }

  if (filter === "completed") {
    tasks = tasks?.filter((task) => task.status === TaskStatus.Completed)
  }

  return { page, tasks, isLoading, setPage, totalCount: data?.totalCount }
}
