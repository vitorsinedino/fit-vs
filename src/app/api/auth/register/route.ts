import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { CreateUserRequest, UserType } from '@/types/user';
import { z } from 'zod';
import { ObjectId } from 'mongodb';

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  tipo: z.nativeEnum(UserType),
  professorId: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    const client = await clientPromise;
    const db = client.db('fitvs');
    const users = db.collection('users');
    
    // Check if user already exists
    const existingUser = await users.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email já está em uso' },
        { status: 400 }
      );
    }
    
    // If registering a student, verify professor exists
    if (validatedData.tipo === UserType.ALUNO && validatedData.professorId) {
      const professor = await users.findOne({ 
        _id: new ObjectId(validatedData.professorId),
        tipo: UserType.PROFESSOR 
      });
      if (!professor) {
        return NextResponse.json(
          { success: false, message: 'Professor não encontrado' },
          { status: 400 }
        );
      }
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcryptjs.hash(validatedData.senha, saltRounds);
    
    // Create user
    const newUser: any = {
      nome: validatedData.nome,
      email: validatedData.email,
      senha: hashedPassword,
      tipo: validatedData.tipo,
      dataCriacao: new Date(),
      ativo: true
    };
    
    // Add relationship fields
    if (validatedData.tipo === UserType.ALUNO && validatedData.professorId) {
      newUser.professorId = validatedData.professorId;
    } else if (validatedData.tipo === UserType.PROFESSOR) {
      newUser.alunosIds = [];
    }
    
    const result = await users.insertOne(newUser);
    
    // If student registration, update professor's students list
    if (validatedData.tipo === UserType.ALUNO && validatedData.professorId) {
      await users.updateOne(
        { _id: new ObjectId(validatedData.professorId) },
        { $addToSet: { alunosIds: result.insertedId.toString() } }
      );
      
      // Create initial progress record
      const progressCollection = db.collection('progressos');
      await progressCollection.insertOne({
        alunoId: result.insertedId.toString(),
        professorId: validatedData.professorId,
        treinosCompletados: 0,
        treinosPendentes: 0,
        mediaProgresso: 0,
        dataUltimaAtualizacao: new Date()
      });
    }
    
    // Return user without password
    const userResponse = {
      _id: result.insertedId.toString(),
      nome: newUser.nome,
      email: newUser.email,
      tipo: newUser.tipo,
      dataCriacao: newUser.dataCriacao,
      ativo: newUser.ativo,
      professorId: newUser.professorId,
      alunosIds: newUser.alunosIds
    };
    
    return NextResponse.json({
      success: true,
      message: 'Usuário criado com sucesso',
      user: userResponse
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}