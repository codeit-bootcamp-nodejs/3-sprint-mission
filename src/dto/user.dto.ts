export class UserDto {
  id!: number;
  email!: string;
  nickname!: string;
  password!: string;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class filteredUserDto {
  id?: number;
  email!: string;
  nickname!: string;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}