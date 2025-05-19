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
    professorId?: string; // Only for students - references professor's _id
    alunosIds?: string[]; // Only for professors - array of student _ids
  }
  
  export interface CreateUserRequest {
    nome: string;
    email: string;
    senha: string;
    tipo: UserType;
    professorId?: string; // Optional for student registration
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
  
  // New types for workouts and progress
  export interface Treino {
    _id?: string;
    nome: string;
    descricao: string;
    professorId: string;
    alunoId: string;
    exercicios: Exercicio[];
    status: 'pendente' | 'em_progresso' | 'concluido';
    dataAtribuido: Date;
    dataConclusao?: Date;
    prazo?: Date;
  }
  
  export interface Exercicio {
    nome: string;
    descricao: string;
    series: number;
    repeticoes: string; // Can be "10-12" or "30 segundos"
    peso?: number;
    descanso?: string; // "60 segundos"
    concluido: boolean;
  }
  
  export interface ProgressoAluno {
    _id?: string;
    alunoId: string;
    professorId: string;
    treinosCompletados: number;
    treinosPendentes: number;
    ultimoTreino?: Date;
    proximoTreino?: Date;
    mediaProgresso: number; // 0-100%
    dataUltimaAtualizacao: Date;
  }
  
  export interface Notificacao {
    _id?: string;
    userId: string;
    tipo: 'treino_novo' | 'treino_prazo' | 'avaliacao' | 'progresso';
    titulo: string;
    mensagem: string;
    lida: boolean;
    dataCriacao: Date;
    dataLeitura?: Date;
    treinoId?: string; // Optional reference
  }