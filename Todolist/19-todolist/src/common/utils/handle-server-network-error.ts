import axios, { AxiosError } from "axios";
import { appActions } from "app/initializeAppTC";
import { AppDispatch } from "../../app/store";

/**
 * Обрабатывает сетевые ошибки и обновляет состояние приложения.
 *
 * @param {unknown} e - Ошибка, которая была выброшена.
 * @param {Dispatch} dispatch - Функция для отправки действий в состояние приложения.
 *
 * Эта функция проверяет, является ли ошибка экземпляром `AxiosError`. Если да, то
 * извлекает сообщение ошибки из `err.message`, иначе добавляет префикс "Native error"
 * к сообщению ошибки. В обоих случаях устанавливает сообщение об ошибке и статус
 * приложения как "failed".
 */

export const handleServerNetworkError = (e: unknown, dispatch: AppDispatch) => {
  const err = e as Error | AxiosError<{ error: string }>;
  const errorMessage = axios.isAxiosError(err) ? err.message || "Some error occurred" : `Native error: ${err.message}`;

  dispatch(appActions.setAppError({ error: errorMessage }));
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
