import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { LoginRequest } from '@/types/user';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória')
});

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    
    const client = await clientPromise;
    const db = client.db('fitvs');
    const users = db.collection('users');
    
    // Find user by email
    const user = await users.findOne({ email: validatedData.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    
    // Check if user is active
    if (!user.ativo) {
      return NextResponse.json(
        { success: false, message: 'Conta desativada' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isPasswordValid = await bcryptjs.compare(validatedData.senha, user.senha);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      tipo: user.tipo
    };
    
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
    
    // Return user without password
    const userResponse = {
      _id: user._id.toString(),
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      dataCriacao: user.dataCriacao,
      ativo: user.ativo
    };
    
    console.log('Login successful for:', user.email); // Debug log
    
    return NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: userResponse,
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
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