'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserType } from '@/types/user';
import AssignStudentModal from '@/components/AssignStudentModal';

interface DashboardData {
  tipo: 'professor' | 'aluno';
  // Professor data
  totalStudents?: number;
  completedWorkouts?: number;
  pendingWorkouts?: number;
  averageProgress?: number;
  recentStudents?: Array<{
    _id: string;
    nome: string;
    email: string;
  }>;
  // Student data
  inProgressWorkouts?: number;
  overallProgress?: number;
  nextWorkout?: {
    _id: string;
    nome: string;
    prazo: string;
  };
  professor?: {
    _id: string;
    nome: string;
    email: string;
  };
  // Common
  notifications: Array<{
    _id: string;
    titulo: string;
    mensagem: string;
    tipo: string;
    dataCriacao: string;
  }>;
}

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [professorInfo, setProfessorInfo] = useState<any>(null);
  const [loadingProfessor, setLoadingProfessor] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchDashboardData();
      // If user is a student, also fetch professor info separately
      if (user.tipo === UserType.ALUNO) {
        fetchStudentProfessor();
      }
    }
  }, [user, loading, router]);

  const fetchDashboardData = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchStudentProfessor = async () => {
    setLoadingProfessor(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch('/api/student/professor', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Professor info fetched:', data.data);
        setProfessorInfo(data.data);
      } else {
        console.error('Failed to fetch professor info');
      }
    } catch (error) {
      console.error('Error fetching professor info:', error);
    } finally {
      setLoadingProfessor(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAssignSuccess = () => {
    setShowAssignModal(false);
    fetchDashboardData(); // Refresh dashboard data
    // Also refresh professor info for students
    if (user?.tipo === UserType.ALUNO) {
      fetchStudentProfessor();
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-lg font-medium text-gray-700">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-black text-gray-900">Fit VS Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-bold">
                Olá, {user.nome}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border-2 ${
                user.tipo === UserType.PROFESSOR 
                  ? 'bg-blue-100 text-blue-800 border-blue-300' 
                  : 'bg-green-100 text-green-800 border-green-300'
              }`}>
                {user.tipo === UserType.PROFESSOR ? 'Professor' : 'Aluno'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-black transition-colors focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2 border-2 border-red-600 hover:border-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              Bem-vindo, {user.nome}!
            </h2>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {user.tipo === UserType.PROFESSOR ? (
                <>
                  <div className="bg-white overflow-hidden shadow-xl rounded-xl border-2 border-gray-200">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-blue-400">
                            <span className="text-white text-xl">👥</span>
                          </div>
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-black text-gray-500 uppercase tracking-wide">
                              Total de Alunos
                            </dt>
                            <dd className="text-2xl font-black text-gray-900">
                              {dashboardData?.totalStudents || 0}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow-xl rounded-xl border-2 border-gray-200">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-green-400">
                            <span className="text-white text-xl">✅</span>
                          </div>
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-black text-gray-500 uppercase tracking-wide">
                              Treinos Concluídos
                            </dt>
                            <dd className="text-2xl font-black text-gray-900">
                              {dashboardData?.completedWorkouts || 0}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow-xl rounded-xl border-2 border-gray-200">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-yellow-400">
                            <span className="text-white text-xl">⏳</span>
                          </div>
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-black text-gray-500 uppercase tracking-wide">
                              Treinos Pendentes
                            </dt>
                            <dd className="text-2xl font-black text-gray-900">
                              {dashboardData?.pendingWorkouts || 0}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow-xl rounded-xl border-2 border-gray-200">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-purple-400">
                            <span className="text-white text-xl">📊</span>
                          </div>
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-black text-gray-500 uppercase tracking-wide">
                              Progresso Médio
                            </dt>
                            <dd className="text-2xl font-black text-gray-900">
                              {dashboardData?.averageProgress || 0}%
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white overflow-hidden shadow-xl rounded-xl border-2 border-gray-200">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-green-400">
                            <span className="text-white text-xl">✅</span>
                          </div>
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-black text-gray-500 uppercase tracking-wide">
                              Treinos Concluídos
                            </dt>
                            <dd className="text-2xl font-black text-gray-900">
                              {dashboardData?.completedWorkouts || 0}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow-xl rounded-xl border-2 border-gray-200">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-yellow-400">
                            <span className="text-white text-xl">⏳</span>
                          </div>
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-black text-gray-500 uppercase tracking-wide">
                              Treinos Pendentes
                            </dt>
                            <dd className="text-2xl font-black text-gray-900">
                              {dashboardData?.pendingWorkouts || 0}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow-xl rounded-xl border-2 border-gray-200">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-blue-400">
                            <span className="text-white text-xl">🏃</span>
                          </div>
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-black text-gray-500 uppercase tracking-wide">
                              Em Progresso
                            </dt>
                            <dd className="text-2xl font-black text-gray-900">
                              {dashboardData?.inProgressWorkouts || 0}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow-xl rounded-xl border-2 border-gray-200">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-purple-400">
                            <span className="text-white text-xl">📊</span>
                          </div>
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-black text-gray-500 uppercase tracking-wide">
                              Seu Progresso
                            </dt>
                            <dd className="text-2xl font-black text-gray-900">
                              {dashboardData?.overallProgress || 0}%
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Professor Information (Students Only) - Updated with new endpoint */}
            {user.tipo === UserType.ALUNO && (
              <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-gray-900">Meu Professor</h3>
                  {loadingProfessor && (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-500">Carregando...</span>
                    </div>
                  )}
                </div>
                
                {professorInfo && professorInfo.professor ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-300">
                        <span className="text-blue-700 font-black text-2xl">
                          {professorInfo.professor.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-gray-900">{professorInfo.professor.nome}</h4>
                        <p className="text-gray-600 font-bold">{professorInfo.professor.email}</p>
                        <p className="text-blue-600 text-sm font-bold">Meu Professor Responsável</p>
                        <p className="text-gray-500 text-xs font-bold">
                          Atribuído em: {new Date(professorInfo.professor.dataCriacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-black transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 border-2 border-blue-600 hover:border-blue-700">
                        Enviar Mensagem
                      </button>
                      <button
                        onClick={fetchStudentProfessor}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
                      >
                        Atualizar Info
                      </button>
                    </div>
                  </div>
                ) : !loadingProfessor ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-gray-200">
                      <span className="text-3xl text-gray-400">👤</span>
                    </div>
                    <h4 className="text-lg font-black text-gray-900 mb-2">Nenhum professor atribuído</h4>
                    <p className="text-gray-600 font-bold mb-4">
                      Você ainda não foi atribuído a um professor. Entre em contato com a administração.
                    </p>
                    <button
                      onClick={fetchStudentProfessor}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                    >
                      Verificar Novamente
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 font-bold mt-2">Carregando informações do professor...</p>
                  </div>
                )}

                {/* Debug info (remove in production) */}
                {professorInfo && (
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
                    <details>
                      <summary className="font-bold cursor-pointer">Debug Info</summary>
                      <pre className="mt-2 text-gray-600">
                        {JSON.stringify(professorInfo, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            )}

            {/* Next Workout (Students Only) */}
            {user.tipo === UserType.ALUNO && dashboardData?.nextWorkout && (
              <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border-2 border-gray-200">
                <h3 className="text-lg font-black text-gray-900 mb-4">Próximo Treino</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-lg text-gray-900">{dashboardData.nextWorkout.nome}</h4>
                    <p className="text-gray-600 font-bold">
                      Prazo: {new Date(dashboardData.nextWorkout.prazo).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-black transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 border-2 border-blue-600 hover:border-blue-700">
                    Iniciar Treino
                  </button>
                </div>
              </div>
            )}

            {/* Recent Students (Professors Only) */}
            {user.tipo === UserType.PROFESSOR && (
              <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-gray-900">Gerenciar Alunos</h3>
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-black transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2 border-2 border-blue-600 hover:border-blue-700"
                  >
                    <span>+</span>
                    <span>Atribuir Aluno</span>
                  </button>
                </div>
                
                {dashboardData?.recentStudents && dashboardData.recentStudents.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentStudents.map((student) => (
                      <div key={student._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200">
                            <span className="text-blue-600 font-black text-lg">
                              {student.nome.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-black text-gray-900">{student.nome}</h4>
                            <p className="text-gray-600 text-sm font-bold">{student.email}</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 font-black transition-colors focus:outline-none focus:underline">
                          Ver Progresso
                        </button>
                      </div>
                    ))}
                    <button className="w-full mt-4 text-blue-600 hover:text-blue-800 font-black text-center py-2 rounded-lg border-2 border-blue-200 hover:bg-blue-50 transition-colors">
                      Ver Todos os Alunos
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-gray-200">
                      <span className="text-4xl text-gray-400">👥</span>
                    </div>
                    <h4 className="text-lg font-black text-gray-900 mb-2">Nenhum aluno ainda</h4>
                    <p className="text-gray-600 mb-6 font-bold">
                      Você ainda não tem alunos atribuídos. Clique no botão acima para atribuir alunos existentes ou aguarde novas inscrições.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            {dashboardData?.notifications && dashboardData.notifications.length > 0 ? (
              <div className="bg-white shadow-xl rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-lg font-black text-gray-900 mb-4">Notificações</h3>
                <div className="space-y-4">
                  {dashboardData.notifications.map((notification) => (
                    <div key={notification._id} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg border-2 border-blue-200">
                      <h4 className="font-black text-sm text-gray-900">{notification.titulo}</h4>
                      <p className="text-gray-700 text-sm mt-1 font-bold">{notification.mensagem}</p>
                      <p className="text-gray-500 text-xs mt-2 font-bold">
                        {new Date(notification.dataCriacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full text-blue-600 hover:text-blue-800 font-black text-center py-2 rounded-lg border-2 border-blue-200 hover:bg-blue-50 transition-colors">
                  Ver todas as notificações
                </button>
              </div>
            ) : (
              <div className="bg-white shadow-xl rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-lg font-black text-gray-900 mb-4">Notificações</h3>
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-gray-200">
                    <span className="text-4xl text-gray-400">🔔</span>
                  </div>
                  <p className="text-gray-600 font-black">Nenhuma notificação no momento</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Assign Student Modal */}
      {showAssignModal && (
        <AssignStudentModal
          onClose={() => setShowAssignModal(false)}
          onSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
}