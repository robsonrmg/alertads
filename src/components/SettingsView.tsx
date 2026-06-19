import React, { useState } from 'react';
import { 
  Save, 
  Smartphone, 
  Settings, 
  Bell, 
  Users, 
  Sliders, 
  Terminal, 
  Check, 
  Plus, 
  X, 
  ShieldCheck, 
  HelpCircle,
  Key
} from 'lucide-react';
import { Page } from '../types';

interface SettingsViewProps {
  onSaveConfig: (formData: any) => void;
}

export default function SettingsView({ onSaveConfig }: SettingsViewProps) {
  // Config States
  const [phone, setPhone] = useState('5511999998888');
  const [apiKey, setApiKey] = useState('wa_live_key_98a7sd8f921kasd');
  const [webhookUrl, setWebhookUrl] = useState('https://app.alertads.com/api/v1/webhook');
  
  // Rules States
  const [alertOnCritical, setAlertOnCritical] = useState(true);
  const [alertOnWarning, setAlertOnWarning] = useState(true);
  const [alertOnCpaDrop, setAlertOnCpaDrop] = useState(true);
  const [cpaThreshold, setCpaThreshold] = useState('25');
  const [ctrThreshold, setCtrThreshold] = useState('1.2');

  // Integrations secret keys mockup
  const [metaDeveloperToken, setMetaDeveloperToken] = useState('EAAGm1tZB26gABALJ3O4z...');
  const [googleDeveloperToken, setGoogleDeveloperToken] = useState('gads_dev_token_88u8a8z01a...');

  // Recipients list
  const [recipients, setRecipients] = useState([
    { id: '1', name: 'Danilo Silva (Diretor Performance)', phone: '5511999998888', active: true },
    { id: '2', name: 'Carla Souza (Coordenadora de Contas)', phone: '5511988887777', active: true },
    { id: '3', name: 'Pedro Santos (Gestor Sênior Solo)', phone: '5521977776666', active: false }
  ]);
  const [newRecName, setNewRecName] = useState('');
  const [newRecPhone, setNewRecPhone] = useState('');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
      onSaveConfig({
        phone,
        apiKey,
        alertOnCritical,
        alertOnWarning,
        cpaThreshold
      });
    }, 700);
  };

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecName.trim() || !newRecPhone.trim()) return;
    
    setRecipients([
      ...recipients,
      {
        id: 'rec_' + Date.now(),
        name: newRecName,
        phone: newRecPhone,
        active: true
      }
    ]);
    setNewRecName('');
    setNewRecPhone('');
  };

  const handleDeleteRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const handleToggleRecipient = (id: string) => {
    setRecipients(recipients.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div id="settings-view-root" className="space-y-8">
      
      {/* Title area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Parametrizações Gerais</h1>
          <p className="text-xs text-[#64748B]">
            Configure destinatários, gatilhos de oscilação de KPIs de anúncios e chaves secretas de APIs.
          </p>
        </div>
        <div>
          <button 
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center space-x-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Configurações Gravadas!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Todas Alterações</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Parameters Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: WhatsApp Gateway Config */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] flex items-center">
              <Smartphone className="w-4 h-4 text-[#2563EB] mr-2" />
              Gateway de Disparo WhatsApp (Conexão Cloud)
            </h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              O AlertAds fornece canais dedicados para entrega rápida. Caso queira usar sua própria instância corporativa pelo plano Enterprise, defina suas chaves abaixo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-[#64748B] mb-1">WhatsApp de Origem / Disparador</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-white text-[#0F172A]"
                  placeholder="Ex: 5511999998888"
                />
              </div>
              <div>
                <label className="block text-[#64748B] mb-1">Token de Acesso Sandbox API</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-white text-[#0F172A]"
                />
              </div>
            </div>

            <div className="text-xs font-semibold pt-1">
              <label className="block text-[#64748B] mb-1">Webhook de Callback para Integradores (Instant Sync)</label>
              <input 
                type="text" 
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-slate-50 font-mono text-[11px] text-[#64748B]"
                readOnly
              />
            </div>
          </div>

          {/* Section 2: Operational triggers limits warnings */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] flex items-center">
              <Sliders className="w-4 h-4 text-[#14B8A6] mr-2" />
              Gatilhos de Alertas e Tolerância de Performance
            </h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Além de reprovações estritas pelas políticas (Facebook Policies), nosso sistema vigia picos e oscilações de gastos e resultados de seus investidores.
            </p>

            <div className="space-y-3 pt-1">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="text-[#0F172A] block">Enviar alertas para anúncios REPROVADOS / BLOQUEADOS</span>
                  <span className="text-[10px] text-[#64748B] block mt-0.5">Alerta prioritário imediato disparado com diagnóstico por inteligência artificial.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={alertOnCritical}
                  onChange={(e) => setAlertOnCritical(e.target.checked)}
                  className="w-5 h-5 text-[#2563EB] focus:ring-[#2563EB] border-[#E2E8F0] rounded cursor-pointer"
                />
              </div>

              <div className="border-t border-[#F1F5F9] my-2" />

              {/* Toggle 2 */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="text-[#0F172A] block">Alertar em caso de esgotamento precoce de Budget Diário</span>
                  <span className="text-[10px] text-[#64748B] block mt-0.5">Disparado quando a campanha atinge 100% de limite diário antes das 18h corporativas.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={alertOnWarning}
                  onChange={(e) => setAlertOnWarning(e.target.checked)}
                  className="w-5 h-5 text-[#2563EB] border-[#E2E8F0] rounded cursor-pointer"
                />
              </div>

              <div className="border-t border-[#F1F5F9] my-2" />

              {/* Toggle 3 */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="text-[#0F172A] block">Flutuação de Meta de Custo por Leads (CPA)</span>
                  <span className="text-[10px] text-[#64748B] block mt-0.5">Ativar disparo se o CPA ultrapassar o limite aceitável de conformidade.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={alertOnCpaDrop}
                  onChange={(e) => setAlertOnCpaDrop(e.target.checked)}
                  className="w-5 h-5 text-[#2563EB] border-[#E2E8F0] rounded cursor-pointer"
                />
              </div>
            </div>

            {alertOnCpaDrop && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold pt-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[#64748B] mb-1">CPA Máximo Tolerável (R$)</label>
                  <input 
                    type="number" 
                    value={cpaThreshold}
                    onChange={(e) => setCpaThreshold(e.target.value)}
                    className="w-full border border-[#E2E8F0] rounded-xl p-2 bg-white text-[#0F172A]"
                    placeholder="Ex: 25"
                  />
                  <span className="text-[9px] text-[#64748B] block mt-1">Alertar se as conversões das últimas 3h excederem este valor.</span>
                </div>
                <div>
                  <label className="block text-[#64748B] mb-1">CTR de Alerta Crítico (%)</label>
                  <input 
                    type="text" 
                    value={ctrThreshold}
                    onChange={(e) => setCtrThreshold(e.target.value)}
                    className="w-full border border-[#E2E8F0] rounded-xl p-2 bg-white text-[#0F172A]"
                    placeholder="Ex: 1.2"
                  />
                  <span className="text-[9px] text-[#64748B] block mt-1">Alertar se a CTR acumulada diária cair abaixo deste patamar.</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Developer credentials secrets tokens fields mockup */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] flex items-center">
              <Key className="w-4 h-4 text-slate-700 mr-2" />
              Chaves de Integração com Redes de Tráfego
            </h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              O AlertAds lê remotamente seus Business Managers e perfis de publicidade. Insira suas credenciais mockadas de desenvolvedor da Meta e do Google.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-[#64748B] mb-1">Meta Ads API (User Access Token)</label>
                <input 
                  type="password" 
                  value={metaDeveloperToken}
                  onChange={(e) => setMetaDeveloperToken(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-white text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-[#64748B] mb-1">Google Ads Developer Token ID</label>
                <input 
                  type="password" 
                  value={googleDeveloperToken}
                  onChange={(e) => setGoogleDeveloperToken(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-white text-[#0F172A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Recipients / Team alert settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#2563EB]" />
              <h3 className="font-bold text-sm text-[#0F172A]">Contatos Destinatários</h3>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Adicione os números de celular dos colaboradores que devem estar cientes dos alertas em tempo real.
            </p>

            {/* List of current recipients */}
            <div className="space-y-2.5 text-xs">
              {recipients.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <div>
                    <h5 className="font-bold text-[#0F172A] text-xs">{r.name}</h5>
                    <span className="text-[10px] text-[#64748B] block mt-0.5 font-mono">{r.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleToggleRecipient(r.id)}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        r.active 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {r.active ? 'Ligado' : 'Mudo'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRecipient(r.id)}
                      className="text-slate-400 hover:text-red-500 transition p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add recipient form */}
            <form onSubmit={handleAddRecipient} className="pt-3 border-t border-[#F1F5F9] space-y-2.5 text-xs">
              <span className="font-bold text-[10px] text-slate-600 block uppercase">Cadastrar Colaborador:</span>
              <div className="space-y-2">
                <input 
                  type="text" 
                  required
                  placeholder="Nome do Gestor de Contas"
                  value={newRecName}
                  onChange={(e) => setNewRecName(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-lg p-2 bg-white text-[#0F172A]"
                />
                <input 
                  type="text" 
                  required
                  placeholder="DDD + Numero WhatsApp (Ex: 5511999998888)"
                  value={newRecPhone}
                  onChange={(e) => setNewRecPhone(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-lg p-2 font-mono bg-white text-[#0F172A]"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center items-center space-x-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Salvar Colaborador</span>
              </button>
            </form>
          </div>

          {/* Security and diagnostics info panel */}
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-4 rounded-2xl flex items-start space-x-3 text-xs leading-normal">
            <ShieldCheck className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-[#065F46]">Conformidade Legal & LGPD</h5>
              <p className="text-[#047857] mt-1 text-[11px] leading-relaxed">
                Nenhuma senha corporativa é gravada. O AlertAds usa exclusivamente tokens de permissão de visualização de performance limitada (Read-Only Ads Insight API) sob conformidade de conformidade estrita das plataformas oficiais Google e Meta.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
