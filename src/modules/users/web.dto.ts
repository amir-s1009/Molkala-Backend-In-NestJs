export type SignupUserDTOReq = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type loginUserDTOReq = {
  email: string;
  password: string;
};

export type loginUserDTORes = {
  token: string;
};
