import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, Lock, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import { Page } from '../types';
import { supabase, getSupabaseConfig } from '../lib/supabase/client';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onLoginSuccess: () => void;
}

export default function LoginPage({ onNavigate, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('gestor@agenciapremium.com.br');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { isConfigured } = getSupabaseConfig();

  const handleForgotPassword = async () => {
    if (!email || email === 'gestor@agenciapremium.com.br') {
      setErrorMsg('Por favor, digite um e-mail válido para recuperar a senha.');
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (!isConfigured) {
        // Mock success in offline mode
        setTimeout(() => {
          setSuccessMsg('E-mail de recuperação simulado com sucesso (Supabase offline).');
          setLoading(false);
        }, 1000);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) {
        setErrorMsg(`Erro Supabase: ${error.message}`);
      } else {
        setSuccessMsg('E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao solicitar redefinição.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Bypass / demo checking
    if (email === 'gestor@agenciapremium.com.br' && password === '123456' && !isConfigured) {
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess();
      }, 800);
      return;
    }

    try {
      if (!isConfigured) {
        // If developer has not configured keys yet, warn user but let them test with mock credentials too
        setErrorMsg('Supabase não foi configurado por variáveis de ambiente. Por favor, crie seu banco ou continue com as credenciais demo: gestor@agenciapremium.com.br / 123456.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(`Erro de Autenticação: ${error.message}`);
      } else if (data?.user) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado de login.');
    } finally {
      setLoading(false);
    }
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
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs">
            {isConfigured ? (
              <p className="text-[#1E3A8A] leading-relaxed">
                🟢 <strong>Supabase Conectado:</strong> Insira seu e-mail e senha cadastrados para acessar com dados reais persistidos na nuvem.
              </p>
            ) : (
              <p className="text-[#2563EB] leading-relaxed">
                ℹ️ <strong>Demonstração Ativa:</strong> Você pode usar as credenciais padrão de teste: <span className="font-mono bg-blue-100 px-1 py-0.5 rounded text-amber-800">gestor@agenciapremium.com.br</span> e senha <span className="font-mono bg-blue-100 px-1 py-0.5 rounded text-amber-800">123456</span> para testar imediatamente o painel.
              </p>
            )}
          </div>

          {errorMsg && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

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
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                >
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
