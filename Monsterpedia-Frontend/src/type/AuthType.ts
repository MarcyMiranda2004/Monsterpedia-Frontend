type RegisterPayload = {
    username: string;
    email: string;
    password: string;
}

type LoginPayload = {
    email: string;
    password: string; 
}

export type { RegisterPayload, LoginPayload };