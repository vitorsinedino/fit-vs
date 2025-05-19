'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation Bar - Mobile First */}
      <nav className="relative z-10 w-full border-b border-gray-200/20 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-700/20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FV</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Fit VS</span>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md text-sm sm:text-base"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Mobile First */}
      <main className="relative">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16 max-w-7xl">
          <div className="text-center mx-auto max-w-4xl">
            {/* Hero Badge - Mobile Optimized */}
            <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Sistema de acompanhamento e gestão de treinos
            </div>

            {/* Main Heading - Mobile First Responsive */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 leading-tight">
              Bem-vindo ao{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Fit VS
              </span>
            </h1>

            {/* Subtitle - Mobile Optimized */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 leading-relaxed font-light px-4 sm:px-0">
              A plataforma completa para{' '}
              <span className="font-semibold text-gray-900 dark:text-white">professores</span>,{' '}
              <span className="font-semibold text-gray-900 dark:text-white">alunos</span> e{' '}
              <span className="font-semibold text-gray-900 dark:text-white">atletas</span>
            </p>

            {/* CTA Buttons - Mobile First with Same Size */}
            <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4 sm:px-0">
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl shadow-lg text-base sm:text-lg min-w-48"
              >
                <span className="relative z-10">Começar agora</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </Link>
              
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 text-base sm:text-lg min-w-48"
              >
                Já tenho uma conta
              </Link>
            </div>

            {/* Features Preview - Mobile First Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-16 sm:mt-20 px-2 sm:px-0">
              <div className="group p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">Acompanhamento Completo</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center text-sm sm:text-base">Monitore o progresso e desempenho em tempo real</p>
              </div>

              <div className="group p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">Gestão de Equipes</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center text-sm sm:text-base">Organize e gerencie professores e atletas</p>
              </div>

              <div className="group p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-lg sm:col-span-2 md:col-span-1">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">Performance Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center text-sm sm:text-base">Insights avançados para melhorar resultados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorations - Mobile Optimized */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-4 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-4 sm:left-10 w-64 h-64 sm:w-96 sm:h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>
      </main>

      {/* Footer - Mobile First */}
      <footer className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center justify-center sm:justify-start space-x-3">
              <div className="h-6 w-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">FV</span>
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">© 2024 Fit VS. Todos os direitos reservados.</span>
            </div>
            
            <div className="flex items-center justify-center space-x-4 sm:space-x-6">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-sm sm:text-base">
                Privacidade
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-sm sm:text-base">
                Termos
              </Link>
              <Link href="/support" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-sm sm:text-base">
                Suporte
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}