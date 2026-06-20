import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase, getSupabaseConfig } from '../../lib/supabase/client';
import { Bell, Check, Loader2, PlayCircle, ToggleLeft, ToggleRight, Phone, AlertTriangle, ShieldCheck } from 'lucide-react';

const notificationsSchema = z.object({
  emailEnabled: z.boolean(),
  whatsappEnabled: z.boolean(),
  whatsappNumber: z.string().trim()
}).refine((data) => {
  if (data.whatsappEnabled) {
    // Validar internacional: apenas números, entre 10 e 15 dígitos.
    const cleanNum = data.whatsappNumber.replace(/\D/g, '');
    return cleanNum.length >= 10 && cleanNum.length <= 15;
  }
  return true;
}, {
  message: "Forneça o celular completo com DDI (Ex: 55) + DDD + Número. Ex: 5511999998888",
  path: ["whatsappNumber"]
});

type NotificationsFormValues = z.infer<typeof notificationsSchema>;

interface NotificationsFormProps {
  onUpdatePhone?: (newPhone: string) => void;
}

export default function NotificationsForm({ onUpdatePhone }: NotificationsFormProps) {
  const [loading, setLoading] = useState(true);
  const [autoSaving, setAutoSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const { isConfigured } = getSupabaseConfig();
  const initRef = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailEnabled: true,
      whatsappEnabled: false,
      whatsappNumber: ''
    }
  });

  const emailEnabled = watch('emailEnabled');
  const whatsappEnabled = watch('whatsappEnabled');
  const whatsappNumber = watch('whatsappNumber');

  // Carregar dados iniciais do Supabase
  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const user = session.user;
          setUserId(user.id);

          if (isConfigured) {
            const { data, error } = await supabase
              .from('notification_settings')
              .select('*')
              .eq('user_id', user.id)
              .maybeSingle();

            if (error) {
              console.error('Erro ao ler configurações no Supabase:', error);
            }

            if (data) {
              setValue('emailEnabled', data.email_enabled);
              setValue('whatsappEnabled', data.whatsapp_enabled);
              setValue('whatsappNumber', data.whatsapp_number || '');
            } else {
              // Se não existir, criar com os canais ativados por padrão
              setValue('emailEnabled', true);
              setValue('whatsappEnabled', true);
              const testPhone = user.user_metadata?.phone || '5511999998888';
              setValue('whatsappNumber', testPhone);

              await supabase.from('notification_settings').insert({
                user_id: user.id,
                email_enabled: true,
                whatsapp_enabled: true,
                whatsapp_number: testPhone
              });
            }
          } else {
            // Fallback Offline / LocalStorage
            setValue('emailEnabled', localStorage.getItem('__alertads_offline_emailEnabled') !== 'false');
            setValue('whatsappEnabled', localStorage.getItem('__alertads_offline_whatsappEnabled') === 'true');
            setValue('whatsappNumber', localStorage.getItem('__alertads_offline_whatsappNumber') || '5511999998888');
          }
        } else {
          // Demo/Sandbox
          setValue('emailEnabled', localStorage.getItem('__alertads_offline_emailEnabled') !== 'false');
          setValue('whatsappEnabled', localStorage.getItem('__alertads_offline_whatsappEnabled') === 'true');
          setValue('whatsappNumber', localStorage.getItem('__alertads_offline_whatsappNumber') || '5511999998888');
        }
      } catch (err: any) {
        console.error('Erro geral ao carregar notificações:', err);
        setErrorMsg('Houve uma falha ao obter as regras de notificação.');
      } finally {
        setLoading(false);
        setTimeout(() => { initRef.current = true; }, 400);
      }
    }

    loadNotifications();
  }, [isConfigured, setValue]);

  // Função para salvar centralmente as configurações
  const performSave = async (data: NotificationsFormValues) => {
    // Validar formato completo antes de salvar
    const isValid = await trigger();
    if (!isValid) return;

    setAutoSaving(true);
    setSaveStatus('idle');
    setErrorMsg(null);

    try {
      if (isConfigured && userId) {
        const { error } = await supabase
          .from('notification_settings')
          .update({
            email_enabled: data.emailEnabled,
            whatsapp_enabled: data.whatsappEnabled,
            whatsapp_number: data.whatsappNumber
          })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Fallback offline
        localStorage.setItem('__alertads_offline_emailEnabled', String(data.emailEnabled));
        localStorage.setItem('__alertads_offline_whatsappEnabled', String(data.whatsappEnabled));
        localStorage.setItem('__alertads_offline_whatsappNumber', data.whatsappNumber);
      }

      setSaveStatus('success');
      if (onUpdatePhone && data.whatsappEnabled) {
        onUpdatePhone(data.whatsappNumber);
      }
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Falha de sync no Supabase notifications:', err);
      setSaveStatus('error');
      setErrorMsg(err.message || 'Erro ao sincronizar canais de notificação no banco.');
    } finally {
      setAutoSaving(false);
    }
  };

  // Observar switches para gravação automática imediata ao alternar
  const handleToggleChange = (field: 'emailEnabled' | 'whatsappEnabled', currentVal: boolean) => {
    setValue(field, !currentVal);
    const updatedValues = {
      emailEnabled: field === 'emailEnabled' ? !currentVal : emailEnabled,
      whatsappEnabled: field === 'whatsappEnabled' ? !currentVal : whatsappEnabled,
      whatsappNumber: whatsappNumber
    };
    performSave(updatedValues);
  };

  // Disparar salvamento debounced ao desfocar ou teclar enter no celular
  const handleInputBlur = () => {
    if (!initRef.current) return;
    performSave({
      emailEnabled,
      whatsappEnabled,
      whatsappNumber
    });
  };

  if (loading) {
    return (
      <div id="notifications-skeleton" className="space-y-6">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="flex justify-between items-center h-14 bg-slate-50 rounded p-4">
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              <div className="h-6 bg-slate-200 rounded w-12"></div>
            </div>
            <div className="flex justify-between items-center h-14 bg-slate-50 rounded p-4">
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              <div className="h-6 bg-slate-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="notifications-view-container" className="space-y-6">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-6">
        
        {/* Header e Status de salvamento automático */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A] flex items-center">
              <Bell className="w-4 h-4 text-[#14B8A6] mr-2" />
              Canais de Notificação Imediata
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Ative e customize como deseja receber alertas urgentes da sua conta do Meta/Google Ads.
            </p>
          </div>
          
          <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider select-none shrink-0">
            {autoSaving ? (
              <span className="text-[#2563EB] flex items-center">
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                Sincronizando...
              </span>
            ) : saveStatus === 'success' ? (
              <span className="text-emerald-600 flex items-center bg-emerald-50 px-2 py-1 rounded">
                <Check className="w-3.5 h-3.5 mr-1" />
                Salvo Automático
              </span>
            ) : saveStatus === 'error' ? (
              <span className="text-rose-600 flex items-center bg-rose-50 px-2 py-1 rounded">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                Erro ao sincronizar
              </span>
            ) : (
              <span className="text-slate-400">Salvo em nuvem</span>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center space-x-2 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Lista de Switches de Notificações */}
        <div className="space-y-4">
          
          {/* Switch 1: E-mail */}
          <div className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl transition hover:border-[#CBD5E1]">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#0F172A] block">Receber alertas por e-mail corporativo</span>
              <span className="text-[10px] text-[#64748B] block">Alerta periódico com relatórios e o sumário de desvios operacionais.</span>
            </div>
            
            <button
              id="switch-email-enabled"
              type="button"
              onClick={() => handleToggleChange('emailEnabled', emailEnabled)}
              className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
            >
              {emailEnabled ? (
                <ToggleRight className="w-10 h-10 text-[#2563EB]" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300" />
              )}
            </button>
          </div>

          {/* Switch 2: WhatsApp */}
          <div className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl transition hover:border-[#CBD5E1]">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#0F172A] block">Receber alertas por WhatsApp (Instantâneo)</span>
              <span className="text-[10px] text-[#64748B] block">Notificações por IA em menos de 10 segundos ao detectar bloqueios ou CPA abusivo.</span>
            </div>
            
            <button
              id="switch-whatsapp-enabled"
              type="button"
              onClick={() => handleToggleChange('whatsappEnabled', whatsappEnabled)}
              className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
            >
              {whatsappEnabled ? (
                <ToggleRight className="w-10 h-10 text-[#10B981]" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300" />
              )}
            </button>
          </div>

          {/* Campo condicional para o celular de WhatsApp */}
          {whatsappEnabled && (
            <div className="bg-slate-50 border border-[#E2E8F0] rounded-2xl p-5 space-y-3 transition-all duration-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#10B981]" />
                <label className="text-xs font-bold text-[#334155] block">Celular para Disparo (WhatsApp)</label>
              </div>
              <p className="text-[10px] text-[#64748B] leading-relaxed">
                Insira o número completo com DDI internacional (Ex: Brasil é <strong className="text-slate-800">55</strong>), DDD da região e o número de celular completo correspondente.
              </p>
              
              <div className="relative">
                <input
                  id="field-notifications-phone"
                  type="text"
                  placeholder="Ex: 5511999998888"
                  className={`w-full border rounded-xl p-3 pr-20 bg-white font-mono text-sm text-[#0F172A] tracking-wider transition focus:outline-none focus:ring-2 ${
                    errors.whatsappNumber 
                      ? 'border-rose-400 focus:ring-rose-200' 
                      : 'border-[#CBD5E1] focus:ring-emerald-100 focus:border-[#10B981]'
                  }`}
                  {...register('whatsappNumber', {
                    onBlur: handleInputBlur
                  })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleInputBlur();
                    }
                  }}
                />
                
                <div className="absolute right-4 top-3 text-[10px] text-slate-400 font-bold select-none">
                  INTL
                </div>
              </div>
              
              {errors.whatsappNumber && (
                <span className="text-rose-600 text-[11px] block mt-1 font-semibold">{errors.whatsappNumber.message}</span>
              )}
            </div>
          )}

        </div>
      </div>

      <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-4 rounded-2xl flex items-start space-x-3 text-xs leading-normal">
        <ShieldCheck className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold text-[#065F46]">WhatsApp Cloud API Protegida</h5>
          <p className="text-[#047857] mt-1 text-[11px] leading-relaxed">
            Seus números de envio cadastrados são protegidos e enviados sob canal seguro com criptografia fim-a-fim. Jamais comercializamos listas ou enviamos spam, os botões ligam exclusivamente as anomalias da IA.
          </p>
        </div>
      </div>
    </div>
  );
}
