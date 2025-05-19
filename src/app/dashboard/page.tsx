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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation Bar */}
      <nav className="relative z-10 w-full border-b border-gray-200/20 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-700/20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FV</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Fit VS</span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Olá, {user.nome}
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${
                  user.tipo === UserType.PROFESSOR 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                }`}>
                  {user.tipo === UserType.PROFESSOR ? 'Professor' : 'Aluno'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Mobile User Info */}
        <div className="sm:hidden mb-6 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.nome.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {user.nome}
              </h3>
              <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${
                user.tipo === UserType.PROFESSOR 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
              }`}>
                {user.tipo === UserType.PROFESSOR ? 'Professor' : 'Aluno'}
              </span>
            </div>
          </div>
        </div>

        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo de volta!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Aqui está um resumo das suas atividades recentes
          </p>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {user.tipo === UserType.PROFESSOR ? (
            <>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Total de Alunos
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData?.totalStudents || 0}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Treinos Concluídos
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData?.completedWorkouts || 0}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Treinos Pendentes
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData?.pendingWorkouts || 0}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Progresso Médio
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData?.averageProgress || 0}%
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Treinos Concluídos
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData?.completedWorkouts || 0}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Treinos Pendentes
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData?.pendingWorkouts || 0}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Em Progresso
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData?.inProgressWorkouts || 0}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Seu Progresso
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData?.overallProgress || 0}%
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {/* Professor Information - Redesigned for Mobile */}
        {user.tipo === UserType.ALUNO && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-xl p-4 sm:p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Meu Professor</h3>
              {loadingProfessor && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Carregando...</span>
                </div>
              )}
            </div>
            
            {professorInfo && professorInfo.professor ? (
              <div className="space-y-4">
                {/* Professor Info */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-2xl">
                        {professorInfo.professor.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                        {professorInfo.professor.nome}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">{professorInfo.professor.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Professor Responsável
                        </span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                        Atribuído em: {new Date(professorInfo.professor.dataCriacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Enviar Mensagem</span>
                  </button>
                  <button
                    onClick={fetchStudentProfessor}
                    className="sm:w-auto bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Atualizar</span>
                  </button>
                </div>
              </div>
            ) : !loadingProfessor ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Nenhum professor atribuído</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Você ainda não foi atribuído a um professor. Entre em contato com a administração.
                </p>
                <button
                  onClick={fetchStudentProfessor}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Verificar Novamente
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400 font-medium mt-2">Carregando informações do professor...</p>
              </div>
            )}
          </div>
        )}

        {/* Next Workout - Students Only */}
        {user.tipo === UserType.ALUNO && dashboardData?.nextWorkout && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-xl p-4 sm:p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Próximo Treino</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="space-y-2">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">{dashboardData.nextWorkout.nome}</h4>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Prazo: {new Date(dashboardData.nextWorkout.prazo).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1" />
                </svg>
                <span>Iniciar Treino</span>
              </button>
            </div>
          </div>
        )}

        {/* Recent Students - Professors Only */}
        {user.tipo === UserType.PROFESSOR && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-xl p-4 sm:p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Gerenciar Alunos</h3>
              <button
                onClick={() => setShowAssignModal(true)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Atribuir Aluno</span>
              </button>
            </div>
            
            {dashboardData?.recentStudents && dashboardData.recentStudents.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentStudents.map((student) => (
                  <div key={student._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg border border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-200 space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {student.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{student.nome}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{student.email}</p>
                      </div>
                    </div>
                    <button className="w-full sm:w-auto text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      Ver Progresso
                    </button>
                  </div>
                ))}
                <button className="w-full mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-center py-3 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                  Ver Todos os Alunos
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Nenhum aluno ainda</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Você ainda não tem alunos atribuídos. Use o botão acima para atribuir alunos existentes.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notificações</h3>
          
          {dashboardData?.notifications && dashboardData.notifications.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.notifications.map((notification) => (
                <div key={notification._id} className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{notification.titulo}</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{notification.mensagem}</p>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                      {new Date(notification.dataCriacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
              <button className="w-full mt-6 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-center py-3 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                Ver todas as notificações
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Nenhuma notificação</h4>
              <p className="text-gray-600 dark:text-gray-400">Você está em dia! Não há notificações pendentes.</p>
            </div>
          )}
        </div>
      </main>

      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-4 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-4 sm:left-10 w-64 h-64 sm:w-96 sm:h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

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