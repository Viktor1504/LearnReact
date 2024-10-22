import { isAxiosError } from 'axios'
import { Dispatch } from 'redux'
import { setAppErrorAC, setAppStatusAC } from '../../app/app-reducer.ts'

export const handleError = (err: unknown, dispatch: Dispatch) => {
  let errorMessage: string
  if (isAxiosError<ServerError>(err)) {
    errorMessage = err.response ? err.response.data.errorMessages[0].message : err.message
  } else {
    errorMessage = (err as Error).message
  }
  dispatch(setAppErrorAC(errorMessage))
  dispatch(setAppStatusAC('failed'))
}

type ServerError = {
  errorMessages: [{ field: string, message: string }]
}