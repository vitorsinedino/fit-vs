import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { UserType } from '@/types/user';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('fitvs');
    const users = db.collection('users');
    
    // Get all active professors
    const professors = await users.find({ 
      tipo: UserType.PROFESSOR,
      ativo: true 
    }, { 
      projection: { senha: 0 } // Exclude password
    }).toArray();
    
    const professorsWithId = professors.map(prof => ({
      ...prof,
      _id: prof._id.toString()
    }));
    
    return NextResponse.json({
      success: true,
      professors: professorsWithId
    });
    
  } catch (error) {
    console.error('Error fetching professors:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}