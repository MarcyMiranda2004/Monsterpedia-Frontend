export type Role = "USER" | "ADMIN";

export type UserDto = {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  role: Role;
}

export type UpdateUserDto = {
  username: string;
}

export type ChangePasswordDto = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export type ChangeEmailDto = {
  password: string;
  currentEmail: string;
  newEmail: string;
  confirmNewEmail: string;
}

export type DeleteUserDto = {
  password: string;
}