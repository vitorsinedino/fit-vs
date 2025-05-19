import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
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
    
    if (decoded.tipo !== 'professor') {
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 }
      );
    }

    const { studentIds } = await request.json();
    
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Lista de estudantes inválida' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('fitvs');
    const users = db.collection('users');
    const progressos = db.collection('progressos');
    
    // Update students to assign them to this professor
    const updateResult = await users.updateMany(
      { 
        _id: { $in: studentIds.map(id => new ObjectId(id)) },
        tipo: 'aluno',
        $or: [
          { professorId: { $exists: false } },
          { professorId: null },
          { professorId: '' }
        ]
      },
      { 
        $set: { professorId: decoded.userId }
      }
    );
    
    // Update professor's student list
    await users.updateOne(
      { _id: new ObjectId(decoded.userId) },
      { 
        $addToSet: { 
          alunosIds: { $each: studentIds }
        }
      }
    );
    
    // Create progress records for newly assigned students
    const progressPromises = studentIds.map(studentId => 
      progressos.updateOne(
        { alunoId: studentId },
        { 
          $setOnInsert: {
            alunoId: studentId,
            professorId: decoded.userId,
            treinosCompletados: 0,
            treinosPendentes: 0,
            mediaProgresso: 0,
            dataUltimaAtualizacao: new Date()
          }
        },
        { upsert: true }
      )
    );
    
    await Promise.all(progressPromises);
    
    // Create notifications for assigned students
    const notificacoes = db.collection('notificacoes');
    const professor = await users.findOne({ _id: new ObjectId(decoded.userId) });
    
    const notificationPromises = studentIds.map(studentId => 
      notificacoes.insertOne({
        userId: studentId,
        tipo: 'atribuicao',
        titulo: 'Novo Professor Atribuído',
        mensagem: `Você foi atribuído ao professor ${professor?.nome}. Bem-vindo!`,
        lida: false,
        dataCriacao: new Date()
      })
    );
    
    await Promise.all(notificationPromises);
    
    return NextResponse.json({
      success: true,
      message: `${updateResult.modifiedCount} estudante(s) atribuído(s) com sucesso`,
      assignedCount: updateResult.modifiedCount
    });
    
  } catch (error) {
    console.error('Error assigning students:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}