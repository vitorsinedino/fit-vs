import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

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
    
    const client = await clientPromise;
    const db = client.db('fitvs');
    const treinos = db.collection('treinos');
    
    // Get user's workouts
    const userWorkouts = await treinos.find({ 
      alunoId: decoded.userId 
    }).sort({ dataAtribuido: -1 }).toArray();
    
    const workoutsWithId = userWorkouts.map(workout => ({
      ...workout,
      _id: workout._id.toString()
    }));
    
    return NextResponse.json({
      success: true,
      workouts: workoutsWithId
    });
    
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}