import { RootState } from "app/store";

export const selectAppStatus = (state: RootState) => state.app.status;
export const selectAppIsInitialized = (state: RootState) => state.app.isInitialized;
export const selectAppError = (state: RootState) => state.app.error;
