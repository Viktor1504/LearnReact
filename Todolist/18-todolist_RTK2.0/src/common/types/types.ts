
export type TestAction<T extends (...args: any) => any> = Omit<ReturnType<T>, "meta">;

export type BaseResponse<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  data: D;
};
