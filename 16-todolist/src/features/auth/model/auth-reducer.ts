import { Dispatch } from "redux"
import { LoginArgs } from "../api/authApi.types"
import { setAppStatusAC } from "../../../app/app-reducer"
import { authApi } from "../api/authApi"
import { ResultCode } from "common/enums"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { clearStateAC } from "../../todolists/model/todolists-reducer"

type InitialStateType = typeof initialState

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
}

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "SET_IS_LOGGED_IN":
      return { ...state, isLoggedIn: action.payload.isLoggedIn }
    case "SET_IS_INITIALIZED":
      return { ...state, isInitialized: action.payload.isInitialized }
    default:
      return state
  }
}
// Action creators
const setIsLoggedInAC = (isLoggedIn: boolean) => {
  return { type: "SET_IS_LOGGED_IN", payload: { isLoggedIn } } as const
}

const setIsInitializedAC = (isInitialized: boolean) => {
  return { type: "SET_IS_INITIALIZED", payload: { isInitialized } } as const
}

// Actions types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | ReturnType<typeof setIsInitializedAC>

// thunks
export const loginTC = (data: LoginArgs) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"))
  authApi
    .login(data)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedInAC(true))
        localStorage.setItem("sn-token", res.data.data.token)
        console.log(res.data.data)
        dispatch(setAppStatusAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"))
  authApi
    .logout()
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatusAC("succeeded"))
        dispatch(setIsLoggedInAC(false))
        localStorage.removeItem("sn-token")
        dispatch(clearStateAC())
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"))
  authApi
    .me()
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatusAC("succeeded"))
        dispatch(setIsLoggedInAC(true))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
    .finally(() => {
      dispatch(setIsInitializedAC(true))
    })
}
