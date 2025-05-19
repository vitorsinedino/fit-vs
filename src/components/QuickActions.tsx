import { UserType } from '@/types/user';

interface QuickActionsProps {
  userType: UserType;
  onAction: (action: string) => void;
}

export default function QuickActions({ userType, onAction }: QuickActionsProps) {
  if (userType === UserType.PROFESSOR) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ações Rápidas</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onAction('create-workout')}
            className="group p-4 sm:p-6 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Criar Treino</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Novo treino para alunos</p>
            </div>
          </button>
          
          <button
            onClick={() => onAction('view-students')}
            className="group p-4 sm:p-6 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50/80 dark:hover:bg-green-900/20 transition-all duration-200 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Ver Alunos</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerenciar estudantes</p>
            </div>
          </button>
          
          <button
            onClick={() => onAction('progress-reports')}
            className="group p-4 sm:p-6 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50/80 dark:hover:bg-purple-900/20 transition-all duration-200 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Relatórios</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Progresso dos alunos</p>
            </div>
          </button>
          
          <button
            onClick={() => onAction('send-notification')}
            className="group p-4 sm:p-6 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-orange-500 dark:hover:border-orange-400 hover:bg-orange-50/80 dark:hover:bg-orange-900/20 transition-all duration-200 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Notificar</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enviar mensagem</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ações Rápidas</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onAction('view-workouts')}
          className="group p-4 sm:p-6 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Meus Treinos</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ver todos os treinos</p>
          </div>
        </button>
        
        <button
          onClick={() => onAction('progress-history')}
          className="group p-4 sm:p-6 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50/80 dark:hover:bg-green-900/20 transition-all duration-200 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Meu Progresso</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Histórico completo</p>
          </div>
        </button>
        
        <button
          onClick={() => onAction('schedule')}
          className="group p-4 sm:p-6 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50/80 dark:hover:bg-purple-900/20 transition-all duration-200 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Agenda</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Próximos treinos</p>
          </div>
        </button>
        
        <button
          onClick={() => onAction('profile')}
          className="group p-4 sm:p-6 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20 transition-all duration-200 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Perfil</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Configurações</p>
          </div>
        </button>
      </div>
    </div>
  );
}