import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  console.log('=== GET /api/student/professor ===');
  
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid auth header found');
      return NextResponse.json(
        { success: false, message: 'Token não fornecido' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      tipo: string;
    };
    
    console.log('✅ Token verified for user:', { userId: decoded.userId, tipo: decoded.tipo });
    
    if (decoded.tipo !== 'aluno') {
      console.log('❌ User is not a student:', decoded.tipo);
      return NextResponse.json(
        { success: false, message: 'Acesso negado - apenas alunos podem acessar' },
        { status: 403 }
      );
    }
    
    console.log('📚 Connecting to MongoDB...');
    const client = await clientPromise;
    const db = client.db('fitvs');
    const users = db.collection('users');
    
    console.log('🔍 Finding student...');
    // Get the student's information
    const student = await users.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { senha: 0 } }
    );
    
    if (!student) {
      console.log('❌ Student not found');
      return NextResponse.json(
        { success: false, message: 'Estudante não encontrado' },
        { status: 404 }
      );
    }
    
    console.log('📋 Student found:', { nome: student.nome, professorId: student.professorId });
    
    let professor = null;
    
    if (student.professorId) {
      console.log('👨‍🏫 Finding professor...');
      // Get the professor's information
      professor = await users.findOne(
        { 
          _id: new ObjectId(student.professorId),
          tipo: 'professor'
        },
        { projection: { senha: 0 } }
      );
      
      if (professor) {
        console.log('✅ Professor found:', { nome: professor.nome, email: professor.email });
      } else {
        console.log('⚠️ Professor not found or invalid professorId');
      }
    } else {
      console.log('⚠️ Student has no professor assigned');
    }
    
    return NextResponse.json({
      success: true,
      data: {
        student: {
          _id: student._id.toString(),
          nome: student.nome,
          email: student.email,
          tipo: student.tipo,
          dataCriacao: student.dataCriacao,
          ativo: student.ativo
        },
        professor: professor ? {
          _id: professor._id.toString(),
          nome: professor.nome,
          email: professor.email,
          tipo: professor.tipo,
          dataCriacao: professor.dataCriacao,
          ativo: professor.ativo
        } : null
      }
    });
    
  } catch (error) {
    console.error('❌ Error in /api/student/professor:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}