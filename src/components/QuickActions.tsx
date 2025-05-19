import { UserType } from '@/types/user';

interface QuickActionsProps {
  userType: UserType;
  onAction: (action: string) => void;
}

export default function QuickActions({ userType, onAction }: QuickActionsProps) {
  if (userType === UserType.PROFESSOR) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onAction('create-workout')}
            className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">🏋️</span>
              </div>
              <h4 className="font-medium">Criar Treino</h4>
              <p className="text-sm text-gray-500">Novo treino para alunos</p>
            </div>
          </button>
          
          <button
            onClick={() => onAction('view-students')}
            className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="font-medium">Ver Alunos</h4>
              <p className="text-sm text-gray-500">Gerenciar estudantes</p>
            </div>
          </button>
          
          <button
            onClick={() => onAction('progress-reports')}
            className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-medium">Relatórios</h4>
              <p className="text-sm text-gray-500">Progresso dos alunos</p>
            </div>
          </button>
          
          <button
            onClick={() => onAction('send-notification')}
            className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">📢</span>
              </div>
              <h4 className="font-medium">Notificar</h4>
              <p className="text-sm text-gray-500">Enviar mensagem</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onAction('view-workouts')}
          className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">🏋️</span>
            </div>
            <h4 className="font-medium">Meus Treinos</h4>
            <p className="text-sm text-gray-500">Ver todos os treinos</p>
          </div>
        </button>
        
        <button
          onClick={() => onAction('progress-history')}
          className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">📈</span>
            </div>
            <h4 className="font-medium">Meu Progresso</h4>
            <p className="text-sm text-gray-500">Histórico completo</p>
          </div>
        </button>
        
        <button
          onClick={() => onAction('schedule')}
          className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">📅</span>
            </div>
            <h4 className="font-medium">Agenda</h4>
            <p className="text-sm text-gray-500">Próximos treinos</p>
          </div>
        </button>
        
        <button
          onClick={() => onAction('profile')}
          className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">⚙️</span>
            </div>
            <h4 className="font-medium">Perfil</h4>
            <p className="text-sm text-gray-500">Configurações</p>
          </div>
        </button>
      </div>
    </div>
  );
}