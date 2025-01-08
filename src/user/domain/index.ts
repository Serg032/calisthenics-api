export interface User {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  admin: boolean;
}

export interface CreateCommand {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  admin?: boolean;
}
