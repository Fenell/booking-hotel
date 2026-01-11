export type ResponseApi<T> = {
  isSuccess: boolean;
  data: T;
  error?: Error;
};

type Error = {
  code: string;
  description: string;
};
