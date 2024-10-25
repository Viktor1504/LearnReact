import { instance } from "../../../common/instance/instance";
import { BaseResponse } from "../../../common/types/types";
import { LoginParamsType } from "./authApi.types";

export const authAPI = {
  login(data: LoginParamsType) {
    const promise = instance.post<BaseResponse<{ userId?: number }>>("auth/login", data);
    return promise;
  },
  logout() {
    const promise = instance.delete<BaseResponse<{ userId?: number }>>("auth/login");
    return promise;
  },
  me() {
    const promise = instance.get<BaseResponse<{ id: number; email: string; login: string }>>("auth/me");
    return promise;
  },
};

