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
    const notificacoes = db.collection('notificacoes');
    const progressos = db.collection('progressos');
    const users = db.collection('users');
    
    let dashboardData: any = {};
    
    if (decoded.tipo === 'professor') {
      // Professor dashboard data
      const students = await users.find({ professorId: decoded.userId }).toArray();
      const studentIds = students.map(s => s._id.toString());
      
      // Get all workouts for professor's students
      const allWorkouts = await treinos.find({ 
        professorId: decoded.userId 
      }).toArray();
      
      // Get progress for all students
      const allProgress = await progressos.find({ 
        professorId: decoded.userId 
      }).toArray();
      
      // Calculate summary
      const totalStudents = students.length;
      const completedWorkouts = allWorkouts.filter(w => w.status === 'concluido').length;
      const pendingWorkouts = allWorkouts.filter(w => w.status === 'pendente').length;
      const averageProgress = allProgress.length > 0 
        ? allProgress.reduce((sum, p) => sum + (p.mediaProgresso || 0), 0) / allProgress.length 
        : 0;
      
      dashboardData = {
        tipo: 'professor',
        totalStudents,
        completedWorkouts,
        pendingWorkouts,
        averageProgress: Math.round(averageProgress),
        recentStudents: students.slice(0, 5).map(s => ({
          _id: s._id.toString(),
          nome: s.nome,
          email: s.email
        }))
      };
      
    } else {
      // Student dashboard data
      const studentWorkouts = await treinos.find({ 
        alunoId: decoded.userId 
      }).toArray();
      
      const progress = await progressos.findOne({ 
        alunoId: decoded.userId 
      });
      
      const completedWorkouts = studentWorkouts.filter(w => w.status === 'concluido').length;
      const pendingWorkouts = studentWorkouts.filter(w => w.status === 'pendente').length;
      const inProgressWorkouts = studentWorkouts.filter(w => w.status === 'em_progresso').length;
      
      // Get next workout
      const nextWorkout = studentWorkouts
        .filter(w => w.status === 'pendente')
        .sort((a, b) => new Date(a.prazo || a.dataAtribuido).getTime() - new Date(b.prazo || b.dataAtribuido).getTime())[0];
      
      dashboardData = {
        tipo: 'aluno',
        completedWorkouts,
        pendingWorkouts,
        inProgressWorkouts,
        overallProgress: progress?.mediaProgresso || 0,
        nextWorkout: nextWorkout ? {
          _id: nextWorkout._id.toString(),
          nome: nextWorkout.nome,
          prazo: nextWorkout.prazo || nextWorkout.dataAtribuido
        } : null
      };
    }
    
    // Get notifications for user
    const notifications = await notificacoes.find({ 
      userId: decoded.userId,
      lida: false 
    }).sort({ dataCriacao: -1 }).limit(5).toArray();
    
    dashboardData.notifications = notifications.map(n => ({
      ...n,
      _id: n._id.toString()
    }));
    
    return NextResponse.json({
      success: true,
      data: dashboardData
    });
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}