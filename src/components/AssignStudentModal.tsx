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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Click outside to close */}
        <div 
          className="absolute inset-0" 
          onClick={onClose}
          aria-hidden="true"
        ></div>

        {/* Modal content */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border-2 border-gray-200">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b-2 border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900">
                Atribuir Alunos
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
            {/* Debug Info */}
            {debugInfo && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm font-medium">
                  Debug: {debugInfo}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{students.length}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{filteredStudents.length}</div>
                  <div className="text-sm text-gray-500">Filtrados</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{selectedStudents.length}</div>
                  <div className="text-sm text-gray-500">Selecionados</div>
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar alunos por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600 font-medium"
              />
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Carregando alunos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">❌</span>
                </div>
                <p className="text-red-700 font-bold mb-2">Erro</p>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchUnassignedStudents}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Tentar novamente
                </button>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl text-gray-400">👥</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno disponível'}
                </h4>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Tente uma busca diferente ou limpe o filtro.'
                    : 'Todos os alunos já foram atribuídos ou não há alunos cadastrados.'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
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
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedStudents.includes(student._id)
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25 hover:shadow-md'
                    }`}
                    onClick={() => handleStudentToggle(student._id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleStudentToggle(student._id)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-blue-700 font-bold text-lg">
                            {student.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">{student.nome}</h4>
                          <p className="text-gray-600 font-medium">{student.email}</p>
                          <p className="text-gray-400 text-sm">ID: {student._id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200 flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="button"
              onClick={handleAssignStudents}
              disabled={selectedStudents.length === 0 || assigning}
              className="flex-1 sm:flex-none inline-flex justify-center items-center rounded-lg border-2 border-transparent shadow-lg px-6 py-3 bg-blue-700 text-lg font-bold text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {assigning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Atribuindo...
                </>
              ) : (
                `Atribuir ${selectedStudents.length} Aluno${selectedStudents.length !== 1 ? 's' : ''}`
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none inline-flex justify-center rounded-lg border-2 border-gray-300 shadow-sm px-6 py-3 bg-white text-lg font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}