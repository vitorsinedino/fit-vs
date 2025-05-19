import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { UserType } from '@/types/user';

export async function GET(request: NextRequest) {
  console.log('=== GET /api/students/unassigned ===');
  
  try {
    console.log('1. Checking authorization header...');
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid auth header found');
      return NextResponse.json(
        { success: false, message: 'Token não fornecido' },
        { status: 401 }
      );
    }
    
    console.log('2. Extracting and verifying token...');
    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      tipo: string;
    };
    
    console.log('✅ Token verified for user:', { userId: decoded.userId, tipo: decoded.tipo });
    
    if (decoded.tipo !== 'professor') {
      console.log('❌ User is not a professor:', decoded.tipo);
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 }
      );
    }
    
    console.log('3. Connecting to MongoDB...');
    const client = await clientPromise;
    const db = client.db('fitvs');
    const users = db.collection('users');
    
    console.log('4. Querying for unassigned students...');
    
    // First, let's see ALL students
    const allStudents = await users.find({ 
      tipo: UserType.ALUNO,
      ativo: true 
    }).toArray();
    
    console.log('📊 All active students found:', allStudents.length);
    allStudents.forEach(student => {
      console.log(`  - ${student.nome} (${student.email}) - professorId: ${student.professorId || 'NONE'}`);
    });
    
    // Now find unassigned ones
    const query = { 
      tipo: UserType.ALUNO,
      ativo: true,
      $or: [
        { professorId: { $exists: false } },
        { professorId: null },
        { professorId: '' }
      ]
    };
    
    console.log('🔍 Query for unassigned:', JSON.stringify(query, null, 2));
    
    const unassignedStudents = await users.find(query, { 
      projection: { senha: 0 }
    }).toArray();
    
    console.log('📋 Unassigned students found:', unassignedStudents.length);
    unassignedStudents.forEach(student => {
      console.log(`  ✅ ${student.nome} (${student.email}) - ID: ${student._id}`);
    });
    
    const studentsWithId = unassignedStudents.map(student => ({
      ...student,
      _id: student._id.toString()
    }));
    
    console.log('5. Returning response with', studentsWithId.length, 'students');
    
    return NextResponse.json({
      success: true,
      students: studentsWithId,
      debug: {
        totalStudents: allStudents.length,
        unassignedStudents: studentsWithId.length,
        requestingProfessor: decoded.userId
      }
    });
    
  } catch (error) {
    console.error('❌ Error in /api/students/unassigned:', error);
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