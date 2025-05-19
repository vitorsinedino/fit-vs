export enum UserType {
    PROFESSOR = 'professor',
    ALUNO = 'aluno'
  }
  
  export interface User {
    _id?: string;
    nome: string;
    email: string;
    senha: string;
    tipo: UserType;
    dataCriacao: Date;
    ativo: boolean;
  }
  
  export interface CreateUserRequest {
    nome: string;
    email: string;
    senha: string;
    tipo: UserType;
  }
  
  export interface LoginRequest {
    email: string;
    senha: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    user?: Omit<User, 'senha'>;
    token?: string;
  }
  
  // Export the type without password for better reusability
  export type UserWithoutPassword = Omit<User, 'senha'>;