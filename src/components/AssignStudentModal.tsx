'use client';

import { useState, useEffect } from 'react';

interface Student {
  _id: string;
  nome: string;
  email: string;
  professorId?: string;
}

interface AssignStudentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignStudentModal({ onClose, onSuccess }: AssignStudentModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    console.log('AssignStudentModal: Component mounted, fetching students...');
    fetchUnassignedStudents();
  }, []);

  const fetchUnassignedStudents = async () => {
    console.log('=== Fetching Unassigned Students ===');
    setDebugInfo('Buscando alunos...');
    
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      console.log('Token found:', !!token);
      setDebugInfo(`Token encontrado: ${!!token}`);

      if (!token) {
        setError('Token de autenticação não encontrado');
        setLoading(false);
        return;
      }

      console.log('Making fetch request to /api/students/unassigned');
      setDebugInfo('Fazendo requisição para API...');

      const response = await fetch('/api/students/unassigned', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      setDebugInfo(`Status da resposta: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        console.log('Students in response:', data.students);
        console.log('Number of students:', data.students?.length || 0);
        
        setDebugInfo(`Resposta recebida. Alunos encontrados: ${data.students?.length || 0}`);
        setStudents(data.students || []);
        
        if (data.students && data.students.length > 0) {
          console.log('First student:', data.students[0]);
        }
      } else {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        setError(`Erro do servidor: ${response.status}`);
        setDebugInfo(`Erro: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Erro de conexão com o servidor');
      setDebugInfo(`Erro de rede: ${error instanceof Error ? error.message : 'Desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentToggle = (studentId: string) => {
    console.log('Toggling student:', studentId);
    setSelectedStudents(prev => {
      const newSelection = prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId];
      console.log('New selection:', newSelection);
      return newSelection;
    });
  };

  const handleAssignStudents = async () => {
    if (selectedStudents.length === 0) {
      console.log('No students selected');
      return;
    }

    console.log('Assigning students:', selectedStudents);
    setAssigning(true);
    setError('');

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch('/api/professor/assign-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentIds: selectedStudents })
      });

      const data = await response.json();
      console.log('Assignment response:', data);

      if (data.success) {
        console.log('Assignment successful');
        onSuccess();
      } else {
        console.error('Assignment failed:', data.message);
        setError(data.message || 'Erro ao atribuir estudantes');
      }
    } catch (error) {
      console.error('Assignment error:', error);
      setError('Erro de conexão');
    } finally {
      setAssigning(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Render state:', {
    loading,
    studentsCount: students.length,
    filteredCount: filteredStudents.length,
    selectedCount: selectedStudents.length
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Click outside to close */}
        <div 
          className="absolute inset-0" 
          onClick={onClose}
          aria-hidden="true"
        ></div>

        {/* Modal content */}
        <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
          {/* Header */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 sm:px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Atribuir Alunos
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[60vh]">
            {/* Debug Info */}
            {debugInfo && (
              <div className="mb-4 p-3 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">
                    Debug: {debugInfo}
                  </p>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-lg backdrop-blur-sm text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{students.length}</div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total</div>
              </div>
              <div className="p-3 sm:p-4 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-lg backdrop-blur-sm text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{filteredStudents.length}</div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Filtrados</div>
              </div>
              <div className="p-3 sm:p-4 bg-green-50/80 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/50 rounded-lg backdrop-blur-sm text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{selectedStudents.length}</div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Selecionados</div>
              </div>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar alunos por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Carregando alunos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-700 dark:text-red-400 font-bold mb-2">Erro</p>
                <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                <button
                  onClick={fetchUnassignedStudents}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Tentar novamente
                </button>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno disponível'}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm 
                    ? 'Tente uma busca diferente ou limpe o filtro.'
                    : 'Todos os alunos já foram atribuídos ou não há alunos cadastrados.'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Limpar busca
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div
                    key={student._id}
                    className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedStudents.includes(student._id)
                        ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/20 shadow-lg backdrop-blur-sm'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-25 dark:hover:bg-blue-900/10 hover:shadow-md backdrop-blur-sm'
                    }`}
                    onClick={() => handleStudentToggle(student._id)}
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => handleStudentToggle(student._id)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 dark:border-gray-600 rounded transition-all duration-200"
                      />
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-lg">
                          {student.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg truncate">{student.nome}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base truncate">{student.email}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs hidden sm:block">ID: {student._id}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <svg className={`w-5 h-5 transition-colors duration-200 ${
                          selectedStudents.includes(student._id) 
                            ? 'text-blue-500' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm px-4 sm:px-6 py-4 border-t border-gray-200/50 dark:border-gray-600/50">
            <div className="flex flex-col sm:flex-row-reverse gap-3">
              <button
                type="button"
                onClick={handleAssignStudents}
                disabled={selectedStudents.length === 0 || assigning}
                className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border border-transparent shadow-lg px-6 py-3 bg-blue-600 hover:bg-blue-700 text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                {assigning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Atribuindo...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Atribuir {selectedStudents.length} Aluno{selectedStudents.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-6 py-3 bg-white dark:bg-gray-800 text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}