import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
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
    
    const client = await clientPromise;
    const db = client.db('fitvs');
    const users = db.collection('users');
    const progressos = db.collection('progressos');
    
    // Get professor's students
    const students = await users.find({ 
      professorId: decoded.userId 
    }, { 
      projection: { senha: 0 } 
    }).toArray();
    
    // Get progress for each student
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const progresso = await progressos.findOne({ alunoId: student._id.toString() });
        return {
          ...student,
          _id: student._id.toString(),
          progresso: progresso || {
            treinosCompletados: 0,
            treinosPendentes: 0,
            mediaProgresso: 0
          }
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      students: studentsWithProgress
    });
    
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}