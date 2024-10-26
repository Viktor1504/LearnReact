import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  addTodolist,
  changeTodolistTitle,
  fetchTodolists,
  FilterValuesType,
  removeTodolist,
  todolistsActions,
} from "../model/todolists.reducer";
import { addTask, removeTask, updateTask } from "../model/tasks.reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { selectIsLoggedIn } from "../../auth/model/auth.selectors";
import { selectTasks } from "../model/tasks.selectors";
import { selectTodolists } from "../model/todolists.selectors";
import { TaskStatuses } from "common/enums";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    dispatch(fetchTodolists());
  }, []);

  const removeTaskCallback = useCallback((taskId: string, todolistId: string) => {
    dispatch(removeTask({ taskId, todolistId: todolistId }));
  }, []);

  const addTaskCallback = useCallback((title: string, todolistId: string) => {
    dispatch(addTask({ title, todolistId }));
  }, []);

  const changeStatus = useCallback((taskId: string, status: TaskStatuses, todolistId: string) => {
    dispatch(updateTask({ taskId, model: { status }, todolistId }));
  }, []);

  const changeTaskTitle = useCallback((taskId: string, newTitle: string, todolistId: string) => {
    dispatch(updateTask({ taskId, model: { title: newTitle }, todolistId }));
  }, []);

  const changeFilter = useCallback((filter: FilterValuesType, id: string) => {
    dispatch(todolistsActions.changeTodolistFilter({ id, filter }));
  }, []);

  const removeTodolistCallback = useCallback((todolistsId: string) => {
    dispatch(removeTodolist(todolistsId));
  }, []);

  const changeTodolistTitleCallback = useCallback((todolistId: string, title: string) => {
    dispatch(changeTodolistTitle({ todolistId, title }));
  }, []);

  const addTodolistCallback = useCallback(
    (title: string) => {
      dispatch(addTodolist(title));
    },
    [dispatch],
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTaskCallback}
                  changeFilter={changeFilter}
                  addTask={addTaskCallback}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolistCallback}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitleCallback}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
