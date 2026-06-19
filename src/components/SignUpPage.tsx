import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, CheckCircle, Mail, User, Building, Smartphone, Lock, AlertTriangle } from 'lucide-react';
import { Page } from '../types';
import { supabase, getSupabaseConfig } from '../lib/supabase/client';

interface SignUpPageProps {
  onNavigate: (page: Page) => void;
  onSignUpSuccess: (email: string, agency: string, phone: string) => void;
}

export default function SignUpPage({ onNavigate, onSignUpSuccess }: SignUpPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { isConfigured } = getSupabaseConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Dynamic credentials fallback
    if (!isConfigured) {
      setTimeout(() => {
        setLoading(false);
        onSignUpSuccess(
          email || 'gestor@agenciapremium.com.br', 
          agencyName || 'Agência Premium Partners', 
          phone || '5511999998888'
        );
      }, 850);
      return;
    }

    try {
      if (password.length < 6) {
        setErrorMsg('A senha precisa ter pelo menos 6 caracteres.');
        setLoading(false);
        return;
      }

      // Execute real Supabase user singup with metadata for handling trigger!
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone,
            agency_name: agencyName
          }
        }
      });

      if (error) {
        setErrorMsg(`Erro de Cadastro: ${error.message}`);
      } else {
        // Fetch or create profile
        onSignUpSuccess(
          email,
          agencyName || 'Agência Premium',
          phone
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao processar cadastro no Supabase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="signup-page-root" className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
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
          Crie seu cadastro grátis
        </h2>
        <p className="mt-2 text-center text-sm text-[#64748B]">
          Ou{' '}
          <button 
            id="btn-switch-to-login"
            onClick={() => onNavigate('login')} 
            className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
          >
            faça login caso já possua registro
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-4 shadow-xl border border-[#E2E8F0] sm:rounded-2xl sm:px-10 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Visual instructions */}
          <div className="md:col-span-5 space-y-6 flex flex-col justify-center">
            <h3 className="font-bold text-lg text-[#0F172A]">Benefícios Imediatos:</h3>
            
            <div className="space-y-4 text-xs tracking-wide">
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-[#14B8A6] mt-0.5 shrink-0" />
                <p className="text-[#64748B] leading-relaxed">
                  <strong className="text-[#0F172A]">Varredura Completa:</strong> Cobertura Meta Ads e Google Ads ativos.
                </p>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-[#14B8A6] mt-0.5 shrink-0" />
                <p className="text-[#64748B] leading-relaxed">
                  <strong className="text-[#0F172A]">Canal Exclusivo:</strong> Sem necessidade de aplicativos adicionais, apenas seu WhatsApp padrão.
                </p>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-[#14B8A6] mt-0.5 shrink-0" />
                <p className="text-[#64748B] leading-relaxed">
                  <strong className="text-[#0F172A]">Múltiplos Sócios:</strong> Cadastre até 5 números para receber em paralelo.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] text-[10px] text-[#64748B]">
              Período de avaliação de 7 dias úteis sem compromisso de cartão de crédito empresarial.
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <form id="signup-form" className="md:col-span-7 space-y-4" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start space-x-2">
                <AlertTriangle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label htmlFor="fullname" className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Nome do Gestor
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="fullname"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] bg-white text-[#0F172A]"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div>
              <label htmlFor="comp-email" className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                E-mail Corporativo
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="comp-email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] bg-white text-[#0F172A]"
                  placeholder="exemplo@suaagencia.com.br"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pass-signup" className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Senha para Acesso
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="pass-signup"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] bg-white text-[#0F172A]"
                  placeholder="Mínimo de 6 caracteres"
                />
              </div>
            </div>

            <div>
              <label htmlFor="agency" className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Nome da Agência Premium
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Building className="h-4 w-4" />
                </div>
                <input
                  id="agency"
                  required
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] bg-white text-[#0F172A]"
                  placeholder="Nome de sua agência de tráfego"
                />
              </div>
            </div>

            <div>
              <label htmlFor="whatsapp-number" className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                WhatsApp Principal para Alertas
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Smartphone className="h-4 w-4" />
                </div>
                <input
                  id="whatsapp-number"
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] bg-white text-[#0F172A]"
                  placeholder="Ex: 5511999998888 (com DDI e DDD)"
                />
              </div>
              <p className="text-[10px] text-[#64748B] mt-1">Preencha com o código do país (DDI Brasil = 55), DDD e número.</p>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                required
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-[#E2E8F0] rounded mt-0.5"
              />
              <label htmlFor="terms" className="ml-2 block text-xs text-[#64748B] leading-tight">
                Declaro que concordo com os Termos de Serviço e Política de Segurança de dados de tráfego.
              </label>
            </div>

            <div className="pt-2">
              <button
                id="btn-submit-signup"
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Criar Meu Acesso Grátis</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
