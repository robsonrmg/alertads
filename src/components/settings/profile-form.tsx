import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase, getSupabaseConfig } from '../../lib/supabase/client';
import { User, CheckCircle, AlertTriangle, Shield, Calendar, Award, Mail } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(3, { message: 'O nome completo deve ter pelo menos 3 caracteres.' }).trim()
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  onUpdateName?: (newName: string) => void;
}

export default function ProfileForm({ onUpdateName }: ProfileFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('Starter');
  const [createdAt, setCreatedAt] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const { isConfigured } = getSupabaseConfig();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: ''
    }
  });

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const user = session.user;
          setUserId(user.id);
          setEmail(user.email || 'gestor@agenciapremium.com.br');
          
          const rawDate = user.created_at ? new Date(user.created_at) : new Date();
          setCreatedAt(rawDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }));

          if (isConfigured) {
            // Fetch real profiles table from Supabase
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();

            if (error) {
              console.error('Erro ao ler perfil do Supabase:', error);
            }

            if (data) {
              setValue('fullName', data.full_name || '');
              setPlan(data.plan ? data.plan.charAt(0).toUpperCase() + data.plan.slice(1) : 'Starter');
            } else {
              // Se a trigger no Supabase não criou o perfil ainda, crie localmente/tente ler metadados
              const fallbackName = user.user_metadata?.full_name || 'Gestor Premium';
              setValue('fullName', fallbackName);
              
              // Tenta criar o registro de profile para ficar em conformidade
              await supabase.from('profiles').insert({
                id: user.id,
                full_name: fallbackName,
                plan: 'starter'
              });
            }
          } else {
            // Fallback Offline / Sandbox
            const localName = localStorage.getItem('__alertads_offline_fullName') || 'Gestor Premium (Offline)';
            setValue('fullName', localName);
            setPlan('Premium Enterprise');
          }
        } else {
          // Usuário Demo/Sandbox guest que não logou oficialmente
          setEmail('guest@demo.alertads.com.br');
          const localName = localStorage.getItem('__alertads_offline_fullName') || 'Gestor Premium (Demo)';
          setValue('fullName', localName);
          setPlan('Advisory Premium Demo');
          const demoDate = new Date();
          setCreatedAt(demoDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }));
        }
      } catch (err: any) {
        console.error('Erro ao processar perfil:', err);
        setErrorMsg('Não foi possível carregar as informações do perfil.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [isConfigured, setValue]);

  const onSubmit = async (values: ProfileFormValues) => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (isConfigured && userId) {
        // Enviar para o banco real (com RLS garantido)
        const { error } = await supabase
          .from('profiles')
          .update({ full_name: values.fullName })
          .eq('id', userId);

        if (error) throw error;
      } else {
        // Salvar offline
        localStorage.setItem('__alertads_offline_fullName', values.fullName);
      }

      setSuccessMsg('Perfil atualizado com absoluto sucesso!');
      if (onUpdateName) {
        onUpdateName(values.fullName);
      }
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      setErrorMsg(err.message || 'Erro de rede ou permissão ao tentar salvar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div id="profile-skeleton" className="space-y-6">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                <div className="h-10 bg-slate-100 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                <div className="h-10 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                <div className="h-10 bg-slate-100 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                <div className="h-10 bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
          <div className="h-10 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div id="profile-form-container" className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-6">
        <div>
          <h3 className="font-bold text-sm text-[#0F172A] flex items-center">
            <User className="w-4 h-4 text-[#2563EB] mr-2" />
            Dados Básicos de Perfil
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            Mantenha seu cadastro corporativo atualizado para conferir credibilidade aos relatórios e alertas enviados.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center space-x-2 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
          <div>
            <label className="block text-[#475569] mb-1.5 flex items-center">
              Nome Completo <span className="text-rose-500 ml-0.5">*</span>
            </label>
            <input
              id="field-profile-fullname"
              type="text"
              className={`w-full border rounded-xl p-2.5 bg-white text-[#0F172A] transition focus:outline-none focus:ring-2 ${
                errors.fullName 
                  ? 'border-rose-400 focus:ring-rose-200' 
                  : 'border-[#E2E8F0] focus:ring-blue-100 focus:border-[#2563EB]'
              }`}
              placeholder="Ex: Danilo Silva"
              {...register('fullName')}
            />
            {errors.fullName && (
              <span className="text-rose-600 text-[11px] block mt-1 font-medium">{errors.fullName.message}</span>
            )}
          </div>

          <div>
            <label className="block text-[#64748B] mb-1.5 flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1 text-[#64748B]" />
              E-mail de Cadastro (Somente leitura)
            </label>
            <input
              id="field-profile-email"
              type="email"
              value={email}
              readOnly
              className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-slate-50 text-slate-500 font-mono font-normal select-all"
            />
          </div>

          <div>
            <label className="block text-[#64748B] mb-1.5 flex items-center">
              <Award className="w-3.5 h-3.5 mr-1 text-[#64748B]" />
              Plano de Assinatura
            </label>
            <div className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-slate-50 flex items-center justify-between">
              <span className="text-slate-700 font-bold">{plan}</span>
              <span className="bg-blue-50 text-[#2563EB] text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border border-blue-100">
                Ativo
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[#64748B] mb-1.5 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#64748B]" />
              Data de Criação da Conta
            </label>
            <input
              id="field-profile-createdat"
              type="text"
              value={createdAt || 'Carregando...'}
              readOnly
              className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-slate-50 text-slate-500 font-normal"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-[#F1F5F9] flex justify-end">
          <button
            id="btn-save-profile"
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Gravando Perfil...</span>
              </>
            ) : (
              <span>Salvar Alterações</span>
            )}
          </button>
        </div>
      </form>

      <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-4 rounded-2xl flex items-start space-x-3 text-xs leading-normal">
        <Shield className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold text-[#1E40AF]">Isolamento de Segurança RGPD/LGPD</h5>
          <p className="text-[#1E40AF]/80 mt-1 text-[11px] leading-relaxed">
            Seus dados cadastrados são estritamente encriptados pelo banco de dados central e protegidos via políticas RLS de usuário único. Nem outros membros de agência nem concorrentes podem ler suas parametrizações de negócio.
          </p>
        </div>
      </div>
    </div>
  );
}
