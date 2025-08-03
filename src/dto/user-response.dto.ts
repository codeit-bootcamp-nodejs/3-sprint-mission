import { User } from "@prisma/client";

const userResponseDTO = (user: User) => {
  const {password, ...userWithoutPassword} = user;
  return userWithoutPassword
}