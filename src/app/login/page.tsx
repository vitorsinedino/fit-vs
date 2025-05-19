'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login({ email, senha });
      
      if (result.success) {
        window.location.href = '/dashboard';
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Erro interno. Tente novamente.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8 border-2 border-gray-200">
          <div className="text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              Entrar na sua conta
            </h2>
            <p className="text-lg text-gray-700 font-medium">
              Ou{' '}
              <Link 
                href="/register" 
                className="font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2 hover:underline-offset-4 transition-all"
              >
                criar uma nova conta
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600 bg-white font-medium text-lg transition-all"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg">
                <p className="text-red-800 text-sm font-bold">❌ {error}</p>
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
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}