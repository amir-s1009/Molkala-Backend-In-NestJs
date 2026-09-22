export class SignupUserDTOReq {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export class loginUserDTOReq {
  email: string;
  password: string;
}

export type loginUserDTORes = {
  token: string;
};
