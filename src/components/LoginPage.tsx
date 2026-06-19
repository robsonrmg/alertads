import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, Lock, Mail, Server } from 'lucide-react';
import { Page } from '../types';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onLoginSuccess: () => void;
}

export default function LoginPage({ onNavigate, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('gestor@agenciapremium.com.br');
  const [password, setPassword] = useState('•••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 800);
  };

  return (
    <div id="login-page-root" className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="p-2.5 bg-[#2563EB] text-white rounded-xl shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-[#0F172A]">
            Alert<span className="text-[#2563EB]">Ads</span>
          </span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Acesse sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-[#64748B]">
          Ou{' '}
          <button 
            id="btn-switch-to-register"
            onClick={() => onNavigate('register')} 
            className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
          >
            crie seu cadastro gratuito agora mesmo
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-250/20 border border-[#E2E8F0] sm:rounded-2xl sm:px-10">
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-xs text-[#2563EB] leading-relaxed">
              <strong>Modo de Demonstração Ativo:</strong> Clique em "Acessar Plataforma" diretamente para simular o painel sob visualização autenticada com as credenciais demo.
            </p>
          </div>

          <form id="login-form" className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                E-mail Corporativo
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] bg-white text-[#0F172A]"
                  placeholder="seu@emailsite.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Senha de Acesso
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] bg-white text-[#0F172A]"
                  placeholder="Sua senha secreta"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-[#E2E8F0] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-[#64748B]">
                  Lembrar minha máquina
                </label>
              </div>

              <div className="text-xs">
                <button type="button" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
                  Esqueceu a senha?
                </button>
              </div>
            </div>

            <div>
              <button
                id="btn-submit-login"
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Acessar Plataforma</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-white text-[#64748B] tracking-widest font-semibold">Segurança</span>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-[#64748B] flex items-center justify-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Conexão SSL Segura • Criptografia AES 256 bits</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
