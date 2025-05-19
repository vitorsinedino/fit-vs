'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserType } from '@/types/user';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Fit VS Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Olá, {user.nome}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                user.tipo === UserType.PROFESSOR 
                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200' 
                  : 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200'
              }`}>
                {user.tipo === UserType.PROFESSOR ? 'Professor' : 'Aluno'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-colors shadow-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-96 p-6 bg-white/50 dark:bg-gray-800/50">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Bem-vindo ao Dashboard, {user.nome}!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">U</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                          Tipo de usuário
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.tipo === UserType.PROFESSOR ? 'Professor' : 'Aluno'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">@</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                          Email
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900 dark:text-white break-all">
                          {user.email}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">D</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                          Membro desde
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                          {new Date(user.dataCriacao).toLocaleDateString('pt-BR')}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {user.tipo === UserType.PROFESSOR && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Funcionalidades do Professor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-lg">Gerenciar Alunos</h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm mt-2 leading-relaxed">Visualizar e gerenciar estudantes matriculados</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-lg">Criar Atividades</h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm mt-2 leading-relaxed">Desenvolver exercícios e avaliações</p>
                </div>
              </div>
            </div>
          )}
          
          {user.tipo === UserType.ALUNO && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Funcionalidades do Aluno</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 text-lg">Ver Atividades</h4>
                  <p className="text-green-800 dark:text-green-200 text-sm mt-2 leading-relaxed">Acessar exercícios e tarefas</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 text-lg">Acompanhar Progresso</h4>
                  <p className="text-green-800 dark:text-green-200 text-sm mt-2 leading-relaxed">Visualizar seu desempenho acadêmico</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}