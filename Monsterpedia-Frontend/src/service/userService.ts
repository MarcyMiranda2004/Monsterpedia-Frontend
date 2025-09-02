import apiFetch from "../type/ApiFetch";
import type {
  UserDto,
  UpdateUserDto,
  ChangePasswordDto,
  ChangeEmailDto,
  DeleteUserDto,
} from "../type/User";

const endpointBase = `/users`;

// Helper per convertire un User in UserDto
export const toUserDto = (user: any): UserDto => ({
  id: user.id,
  username: user.username,
  email: user.email,
  avatarUrl: user.avatarUrl,
  role: user.role,
});

// GET - lista utenti
export const getUsers = async (): Promise<UserDto[]> => {
  const users = await apiFetch<any[]>(`${endpointBase}`);
  return users.map(toUserDto);
};

// GET - utente per ID
export const getUserById = async (id: number): Promise<UserDto> => {
  const user = await apiFetch<any>(`${endpointBase}/${id}`);
  return toUserDto(user);
};

// GET - ricerca utenti con query e paginazione
export const searchUserDtos = async (
  query: string,
  page: number = 0,
  size: number = 10
): Promise<{ content: UserDto[]; totalElements: number }> => {
  const response = await apiFetch<any>(
    `${endpointBase}/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`
  );
  return {
    content: response.content.map(toUserDto),
    totalElements: response.totalElements,
  };
};

// POST - crea nuovo utente (registrazione)
export const createUser = (data: UserDto): Promise<UserDto> =>
  apiFetch<UserDto>(`${endpointBase}`, "POST", data);

// PUT - aggiorna username
export const updateUser = (id: number, data: UpdateUserDto): Promise<UserDto> =>
  apiFetch<UserDto>(`${endpointBase}/${id}`, "PUT", data);

// PUT - aggiorna password
export const changePassword = (id: number, data: ChangePasswordDto): Promise<void> =>
  apiFetch<void>(`${endpointBase}/${id}/password`, "PUT", data);

// PUT - aggiorna email
export const changeEmail = (id: number, data: ChangeEmailDto): Promise<void> =>
  apiFetch<void>(`${endpointBase}/${id}/email`, "PUT", data);

// DELETE - elimina utente (serve password di conferma)
export const deleteUser = (id: number, data: DeleteUserDto): Promise<void> =>
  apiFetch<void>(`${endpointBase}/${id}`, "DELETE", data);

// POST - aggiorna avatar (usa FormData invece di JSON)
export const updateAvatar = async (id: number, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("token");

  const response = await fetch(`${endpointBase}/${id}/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Errore caricamento avatar");
  }

  return response.text();
};
