import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { ErrorSnackbar, Header } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { selectIsInitialized, selectThemeMode } from "./appSelectors"
import { Outlet } from "react-router-dom"
import { useEffect } from "react"
import { initializeAppTC } from "../features/auth/model/auth-reducer"
import { CircularProgress } from "@mui/material"
import s from "./App.module.css"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()

  const isInitialized = useAppSelector(selectIsInitialized)

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [])

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      {isInitialized && (
        <>
          <Header />
          <Outlet />
        </>
      )}
      {!isInitialized && (
        <div className={s.circularProgressContainer}>
          <CircularProgress size={150} thickness={3} />
        </div>
      )}
      <ErrorSnackbar />
    </ThemeProvider>
  )
}
