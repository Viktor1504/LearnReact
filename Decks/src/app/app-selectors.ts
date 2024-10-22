import { AppRootState } from './store.ts'
import { RequestStatusType } from './app-reducer.ts'

export const selectAppStatus = (state: AppRootState): RequestStatusType => state.app.status
export const selectAppError = (state: AppRootState): string | null => state.app.error