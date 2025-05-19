'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserType } from '@/types/user';
import Link from 'next/link';

interface Professor {
  _id: string;
  nome: string;
  email: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: UserType.ALUNO,
    professorId: ''
  });
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfessors, setLoadingProfessors] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  // Fetch professors when user selects "Aluno"
  useEffect(() => {
    if (formData.tipo === UserType.ALUNO) {
      fetchProfessors();
    } else {
      setProfessors([]);
    }
  }, [formData.tipo]);

  const fetchProfessors = async () => {
    setLoadingProfessors(true);
    try {
      const response = await fetch('/api/professors');
      if (response.ok) {
        const data = await response.json();
        setProfessors(data.professors || []);
      }
    } catch (error) {
      console.error('Error fetching professors:', error);
    } finally {
      setLoadingProfessors(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset professorId when switching from aluno to professor
    if (name === 'tipo' && value === UserType.PROFESSOR) {
      setFormData(prev => ({
        ...prev,
        professorId: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Create registration data - don't include professorId if empty
    const registerData = {
      ...formData,
      professorId: formData.professorId || undefined
    };

    const result = await register(registerData);

    if (result.success) {
      setSuccess('Conta criada com sucesso! Redirecionando para login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8 border-2 border-gray-200">
          <div className="text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              Criar conta
            </h2>
            <p className="text-lg text-gray-700 font-medium">
              Ou{' '}
              <Link 
                href="/login" 
                className="font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2 hover:underline-offset-4 transition-all"
              >
                entrar na sua conta existente
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-bold text-gray-900 mb-2">
                  Nome completo
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600 bg-white font-medium text-lg transition-all"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600 bg-white font-medium text-lg transition-all"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="senha" className="block text-sm font-bold text-gray-900 mb-2">
                  Senha
                </label>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600 bg-white font-medium text-lg transition-all"
                  placeholder="Senha (mínimo 6 caracteres)"
                  value={formData.senha}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="tipo" className="block text-sm font-bold text-gray-900 mb-2">
                  Tipo de usuário
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600 font-medium text-lg text-gray-900 transition-all"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <option value={UserType.ALUNO}>Aluno</option>
                  <option value={UserType.PROFESSOR}>Professor</option>
                </select>
              </div>
              
              {/* Professor selection for students - OPTIONAL */}
              {formData.tipo === UserType.ALUNO && (
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <label htmlFor="professorId" className="block text-sm font-bold text-gray-900 mb-2">
                    Selecione seu professor (opcional)
                  </label>
                  <p className="text-sm text-gray-700 mb-3 font-medium">
                    Você pode escolher um professor agora ou ser atribuído posteriormente.
                  </p>
                  {loadingProfessors ? (
                    <div className="flex items-center py-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                      <span className="text-sm text-gray-600 font-medium">Carregando professores...</span>
                    </div>
                  ) : (
                    <select
                      id="professorId"
                      name="professorId"
                      className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600 font-medium text-lg text-gray-900 transition-all"
                      value={formData.professorId}
                      onChange={handleChange}
                    >
                      <option value="">Nenhum professor (escolher depois)</option>
                      {professors.map((professor) => (
                        <option key={professor._id} value={professor._id}>
                          {professor.nome} ({professor.email})
                        </option>
                      ))}
                    </select>
                  )}
                  {professors.length === 0 && !loadingProfessors && (
                    <p className="mt-2 text-sm text-orange-700 font-semibold bg-orange-100 p-3 rounded-lg border border-orange-200">
                      ⚠️ Nenhum professor disponível. Você pode se registrar e ser atribuído a um professor posteriormente.
                    </p>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg">
                <p className="text-red-800 text-sm font-bold">❌ {error}</p>
              </div>
            )}
            
            {success && (
              <div className="p-4 bg-green-100 border-2 border-green-300 rounded-lg">
                <p className="text-green-800 text-sm font-bold">✅ {success}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-6 border-2 border-transparent text-lg font-black rounded-lg text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}