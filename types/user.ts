interface UpdateUserData {
  username?: string;
  email?: string;
  address?: string;
  password?: string;
  imageUrl?: string;
  refreshToken: string | null
}

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  address: string;
  imageUrl?: string | null;
}

export { CreateUserData, UpdateUserData }