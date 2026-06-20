import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  ShieldCheck, 
  Smartphone, 
  Sliders, 
  Key, 
  Users, 
  Save, 
  Check, 
  Plus, 
  X,
  HelpCircle
} from 'lucide-react';
import ProfileForm from './settings/profile-form';
import NotificationsForm from './settings/notifications-form';
import SecurityForm from './settings/security-form';

interface SettingsViewProps {
  onSaveConfig: (formData: any) => void;
  onUpdateName?: (newName: string) => void;
  onUpdatePhone?: (newPhone: string) => void;
}

export default function SettingsView({ onSaveConfig, onUpdateName, onUpdatePhone }: SettingsViewProps) {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'gateway'>('profile');

  // Gateway e Parametrizações locais para a aba "Disparos & APIs" (compatibilidade de recursos antigos)
  const [phone, setPhone] = useState('5511999998888');
  const [apiKey, setApiKey] = useState('wa_live_key_98a7sd8f921kasd');
  const [webhookUrl, setWebhookUrl] = useState('https://app.alertads.com/api/v1/webhook');
  
  const [alertOnCritical, setAlertOnCritical] = useState(true);
  const [alertOnWarning, setAlertOnWarning] = useState(true);
  const [alertOnCpaDrop, setAlertOnCpaDrop] = useState(true);
  const [cpaThreshold, setCpaThreshold] = useState('25');
  const [ctrThreshold, setCtrThreshold] = useState('1.2');

  const [metaDeveloperToken, setMetaDeveloperToken] = useState('EAAGm1tZB26gABALJ3O4z...');
  const [googleDeveloperToken, setGoogleDeveloperToken] = useState('gads_dev_token_88u8a8z01a...');

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
    <div id="settings-view-root" className="space-y-6">
      
      {/* Title e Header Area */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Configurações Gerais</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Gerencie seu perfil de agência, configure os canais de recebimento de alertas e mude ou recupere chaves de segurança.
        </p>
      </div>

      {/* Tabs Navigation Layout - Altamente Responsivo */}
      <div className="border-b border-[#E2E8F0] -mx-4 px-4 sm:mx-0 sm:px-0">
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none" aria-label="Abas de Configuração">
          <button
            id="tab-btn-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Perfil da Conta</span>
          </button>

          <button
            id="tab-btn-notifications"
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'notifications'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Canais & Notificações</span>
          </button>

          <button
            id="tab-btn-security"
            onClick={() => setActiveTab('security')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Credenciais & Segurança</span>
          </button>

          <button
            id="tab-btn-gateway"
            onClick={() => setActiveTab('gateway')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'gateway'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Gateway & APIs Ads</span>
          </button>
        </nav>
      </div>

      {/* Renderização Condicional de Abas com Efeitos Fluidos */}
      <div className="transition-all duration-300">
        
        {/* ABA 1: PERFIL */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in" id="settings-tab-profile">
            <ProfileForm onUpdateName={onUpdateName} />
          </div>
        )}

        {/* ABA 2: NOTIFICAÇÕES */}
        {activeTab === 'notifications' && (
          <div className="animate-fade-in" id="settings-tab-notifications">
            <NotificationsForm onUpdatePhone={onUpdatePhone} />
          </div>
        )}

        {/* ABA 3: SEGURANÇA */}
        {activeTab === 'security' && (
          <div className="animate-fade-in" id="settings-tab-security">
            <SecurityForm />
          </div>
        )}

        {/* ABA 4: CONFIGURAÇÕES E DIRETRIZES DE GATEWAY ANTIGAS (PRESERVA COMPATIBILIDADE) */}
        {activeTab === 'gateway' && (
          <div className="space-y-6 animate-fade-in" id="settings-tab-gateway">
            
            {/* Título interno com botão de salvar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-[#E2E8F0] p-4 rounded-2xl">
              <div>
                <h4 className="font-bold text-xs text-[#0F172A] uppercase tracking-wider">
                  Chaves de Conexão com Facebook/Google Ads
                </h4>
                <p className="text-[10px] text-[#64748B] mt-0.5">
                  Edite e teste thresholds operacionais, limites e webhooks de callback da sandbox.
                </p>
              </div>
              <button 
                onClick={handleSaveAll}
                disabled={saving}
                className="flex items-center space-x-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Salvo!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Gateway</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column forms */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Gateway config */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-sm text-[#0F172A] flex items-center">
                    <Smartphone className="w-4 h-4 text-[#2563EB] mr-2" />
                    Instância Exclusiva de Disparo Automático (WhatsApp Cloud)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block text-[#64748B] mb-1">WhatsApp de Origem</label>
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-white text-[#0F172A]"
                        placeholder="Ex: 5511999998888"
                      />
                    </div>
                    <div>
                      <label className="block text-[#64748B] mb-1">Token Sandbox API</label>
                      <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-white text-[#0F172A]"
                      />
                    </div>
                  </div>

                  <div className="text-xs font-semibold pt-1">
                    <label className="block text-[#64748B] mb-1">Webhook de Callback para Eventos e Sincronizações</label>
                    <input 
                      type="text" 
                      value={webhookUrl}
                      readOnly
                      className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-slate-50 font-mono text-[11px] text-[#64748B] select-all"
                    />
                  </div>
                </div>

                {/* Gatilhos de Alerta */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-sm text-[#0F172A] flex items-center">
                    <Sliders className="w-4 h-4 text-[#14B8A6] mr-2" />
                    Gatilhos e Limites Aceitáveis de Performance
                  </h3>

                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div>
                        <span className="text-[#0F172A] block">Disparar alertas para anúncios REPROVADOS / REJEITADOS</span>
                        <span className="text-[10px] text-[#64748B] block mt-0.5">Alerta urgente enviado assim que a rede de anúncios reprova ou pausa o criativo.</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={alertOnCritical}
                        onChange={(e) => setAlertOnCritical(e.target.checked)}
                        className="w-5 h-5 text-[#2563EB] border-[#E2E8F0] rounded cursor-pointer"
                      />
                    </div>

                    <div className="border-t border-[#F1F5F9] my-2" />

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div>
                        <span className="text-[#0F172A] block">Avisar em caso de limite de Budget esgotado</span>
                        <span className="text-[10px] text-[#64748B] block mt-0.5">Notifica se a campanha consumir todo o orçamento planejado.</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={alertOnWarning}
                        onChange={(e) => setAlertOnWarning(e.target.checked)}
                        className="w-5 h-5 text-[#2563EB] border-[#E2E8F0] rounded cursor-pointer"
                      />
                    </div>

                    <div className="border-t border-[#F1F5F9] my-2" />

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div>
                        <span className="text-[#0F172A] block">Gatilhos adicionais de oscilação do CPA</span>
                        <span className="text-[10px] text-[#64748B] block mt-0.5">Alertar se as conversões das últimas horas ultrapassarem o valor ótimo.</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold pt-3 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-slide-up">
                      <div>
                        <label className="block text-[#64748B] mb-1">CPA Máximo Aceito de Lead (R$)</label>
                        <input 
                          type="number" 
                          value={cpaThreshold}
                          onChange={(e) => setCpaThreshold(e.target.value)}
                          className="w-full border border-[#E2E8F0] rounded-xl p-2 bg-white text-[#0F172A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#64748B] mb-1">Limite Crítico Mínimo de CTR (%)</label>
                        <input 
                          type="text" 
                          value={ctrThreshold}
                          onChange={(e) => setCtrThreshold(e.target.value)}
                          className="w-full border border-[#E2E8F0] rounded-xl p-2 bg-white text-[#0F172A]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Developer Token */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-sm text-[#0F172A] flex items-center">
                    <Key className="w-4 h-4 text-slate-700 mr-2" />
                    Chaves de Desenvolvedor da Meta / Google Ads
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block text-[#64748B] mb-1">Meta Ads Dev Token</label>
                      <input 
                        type="password" 
                        value={metaDeveloperToken}
                        onChange={(e) => setMetaDeveloperToken(e.target.value)}
                        className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-white text-[#0F172A]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#64748B] mb-1">Google Ads Dev Token</label>
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

              {/* Right Column Recipients */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#2563EB]" />
                    <h3 className="font-bold text-sm text-[#0F172A]">Contatos Secundários de Alerta</h3>
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    Cadastre números corporativos adicionais na sua assessoria para estarem informados em tempo de execução nos painéis operacionais.
                  </p>

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
                            {r.active ? 'Ativo' : 'Mudo'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRecipient(r.id)}
                            className="text-slate-400 hover:text-red-500 transition p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add collaborator form */}
                  <form onSubmit={handleAddRecipient} className="pt-3 border-t border-[#F1F5F9] space-y-2 text-xs">
                    <span className="font-bold text-[10px] text-slate-600 block uppercase">Adicionar Contato:</span>
                    <input 
                      type="text" 
                      required
                      placeholder="Nome do Gestor"
                      value={newRecName}
                      onChange={(e) => setNewRecName(e.target.value)}
                      className="w-full border border-[#E2E8F0] rounded-lg p-2 bg-white text-[#0F172A]"
                    />
                    <input 
                      type="text" 
                      required
                      placeholder="Celular DDI+DDD (Ex: 5511...)"
                      value={newRecPhone}
                      onChange={(e) => setNewRecPhone(e.target.value)}
                      className="w-full border border-[#E2E8F0] rounded-lg p-2 font-mono bg-white text-[#0F172A]"
                    />
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center space-x-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Adicionar Contato</span>
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
