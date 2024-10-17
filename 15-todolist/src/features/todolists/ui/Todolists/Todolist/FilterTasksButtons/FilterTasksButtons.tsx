import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { useAppDispatch } from "common/hooks"
import { changeTodolistFilterAC, FilterValuesType, DomainTodolist } from "../../../../model/todolists-reducer"
import { filterButtonsContainerSx } from "./FilterTasksButtons.styles"

type Props = {
  todolist: DomainTodolist
  disabled?: boolean
}

export const FilterTasksButtons = ({ todolist, disabled }: Props) => {
  const { filter, id } = todolist

  const dispatch = useAppDispatch()

  const changeFilterTasksHandler = (filter: FilterValuesType) => {
    dispatch(changeTodolistFilterAC({ id, filter }))
  }

  return (
    <Box sx={filterButtonsContainerSx(!!disabled)}>
      <Button
        variant={filter === "all" ? "outlined" : "text"}
        color={"inherit"}
        onClick={() => changeFilterTasksHandler("all")}
      >
        All
      </Button>
      <Button
        variant={filter === "active" ? "outlined" : "text"}
        color={"primary"}
        onClick={() => changeFilterTasksHandler("active")}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "outlined" : "text"}
        color={"secondary"}
        onClick={() => changeFilterTasksHandler("completed")}
      >
        Completed
      </Button>
    </Box>
  )
}
