import { Role } from "@prisma/client";

export type UserInfoDTO = {
  userId: string;
  roles: Role[];
  firstName: string;
  lastName: string;
};
