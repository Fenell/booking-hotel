export type LoginRequest = {
  userName: string;
  password: string;
};

export type LoginReponse = {
  id: string;
  userName: string;
  token: string;
};
