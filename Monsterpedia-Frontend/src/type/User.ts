export type Role = "USER" | "ADMIN";

export interface UserDto {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  role: Role;
}

export interface UpdateUserDto {
  username: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangeEmailDto {
  password: string;
  currentEmail: string;
  newEmail: string;
  confirmNewEmail: string;
}

export interface DeleteUserDto {
  password: string;
}