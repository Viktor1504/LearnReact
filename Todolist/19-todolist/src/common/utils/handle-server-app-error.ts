import { appActions } from "app/initializeAppTC";
import { BaseResponseType } from "../types";
import { AppDispatch } from "../../app/store";

/**
 * Обрабатывает ошибки приложения на стороне сервера, отправляя сообщения об ошибках и устанавливая статус приложения.
 *
 * @template D
 * @param {BaseResponseType<D>} data - Данные ответа от сервера, содержащие сообщения об ошибках.
 * @param {Dispatch} dispatch - Функция dispatch для обновления состояния приложения.
 * @param {boolean} [isShowGlobalError=true] - Флаг, указывающий, следует ли показывать глобальное сообщение об ошибке.
 *
 * @returns {void} - Функция ничего не возвращает
 */

export const handleServerAppError = <D>(
  data: BaseResponseType<D>,
  dispatch: AppDispatch,
  isShowGlobalError: boolean = true,
): void => {
  if (isShowGlobalError) {
    dispatch(appActions.setAppError({ error: isShowGlobalError ? data.messages[0] : "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
