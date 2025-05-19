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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation Bar */}
      <nav className="relative z-10 w-full border-b border-gray-200/20 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-700/20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FV</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Fit VS</span>
            </Link>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Criar conta
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Ou{' '}
              <Link 
                href="/login" 
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors underline underline-offset-2"
              >
                entrar na sua conta existente
              </Link>
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50">
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Nome */}
              <div className="space-y-1">
                <label htmlFor="nome" className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Nome completo
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 transition-all duration-200"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </div>
              
              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 transition-all duration-200"
                  placeholder="Digite seu email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              {/* Senha */}
              <div className="space-y-1">
                <label htmlFor="senha" className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Senha
                </label>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 transition-all duration-200"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.senha}
                  onChange={handleChange}
                />
              </div>
              
              {/* Tipo de usuário */}
              <div className="space-y-1">
                <label htmlFor="tipo" className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Tipo de usuário
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all duration-200"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <option value={UserType.ALUNO}>Aluno</option>
                  <option value={UserType.PROFESSOR}>Professor</option>
                </select>
              </div>
              
              {/* Professor selection - only for students */}
              {formData.tipo === UserType.ALUNO && (
                <div className="p-4 rounded-lg bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50">
                  <label htmlFor="professorId" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Selecione seu professor (opcional)
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Você pode escolher um professor agora ou ser atribuído posteriormente.
                  </p>
                  {loadingProfessors ? (
                    <div className="flex items-center py-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Carregando professores...</span>
                    </div>
                  ) : (
                    <select
                      id="professorId"
                      name="professorId"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all duration-200"
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
                    <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 rounded-lg">
                      <p className="text-sm text-orange-800 dark:text-orange-300 font-medium">
                        ⚠️ Nenhum professor disponível. Você pode se registrar e ser atribuído posteriormente.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-800 dark:text-red-300 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}
              
              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800 dark:text-green-300 text-sm font-medium">{success}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              Ao criar uma conta, você concorda com nossos{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                Termos de Serviço
              </Link>{' '}
              e{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-4 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-4 sm:left-10 w-64 h-64 sm:w-96 sm:h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}