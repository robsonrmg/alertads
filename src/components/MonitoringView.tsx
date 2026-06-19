import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Facebook, 
  Chrome, 
  Sliders, 
  CheckCircle, 
  XOctagon, 
  Play, 
  Pause, 
  Trash2, 
  Layers, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { AdAccount, Platform } from '../types';

interface MonitoringViewProps {
  accounts: AdAccount[];
  onAddAccount: (name: string, platform: Platform, spend: number) => void;
  onToggleStatus: (id: string) => void;
  onDeleteAccount: (id: string) => void;
  onForceSync: () => void;
}

export default function MonitoringView({ accounts, onAddAccount, onToggleStatus, onDeleteAccount, onForceSync }: MonitoringViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccPlatform, setNewAccPlatform] = useState<Platform>('facebook');
  const [newAccSpend, setNewAccSpend] = useState('500');
  const [syncing, setSyncing] = useState(false);

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) return;

    onAddAccount(newAccName, newAccPlatform, parseFloat(newAccSpend) || 0);
    setNewAccName('');
    setShowAddForm(false);
  };

  const handleSyncClick = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      onForceSync();
    }, 1000);
  };

  return (
    <div id="monitoring-view-root" className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Canais Integrados e Contas</h1>
          <p className="text-xs text-[#64748B]">
            Gerencie quais contas de anúncios estão ativas no rastreador para receber disparos instantâneos.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSyncClick}
            disabled={syncing}
            className="flex items-center space-x-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2563EB] ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
          </button>

          <button 
            id="open-add-acc-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Vincular Nova Conta</span>
          </button>
        </div>
      </div>

      {/* Slide-in/Toggle form to create an account mock */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-[#2563EB]/40 p-6 rounded-2xl shadow-xl space-y-4 animate-fade-in">
          <h3 className="font-bold text-sm text-[#0F172A]">Simulador: Sincronizar Nova Conta de Tráfego</h3>
          <p className="text-[11px] text-[#64748B] leading-normal">
            Esse formulário simula a integração via OAuth de um cliente de sua agência de tráfego. Adicione livremente para testar a reatividade do painel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-[#64748B] mb-1">Nome Fantasia da Conta / Cliente</label>
              <input 
                type="text" 
                required
                value={newAccName}
                onChange={(e) => setNewAccName(e.target.value)}
                placeholder="Ex: Stellars Store - FB"
                className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-white text-[#0F172A]"
              />
            </div>
            <div>
              <label className="block text-[#64748B] mb-1">Canal de Anúncios</label>
              <select 
                value={newAccPlatform} 
                onChange={(e) => setNewAccPlatform(e.target.value as Platform)}
                className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-white text-[#0F172A]"
              >
                <option value="facebook">Meta Ads (Facebook / Instagram)</option>
                <option value="google">Google Ads (Pesquisa / YouTube)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#64748B] mb-1">Orçamento Médio Diário (R$)</label>
              <input 
                type="number" 
                value={newAccSpend}
                onChange={(e) => setNewAccSpend(e.target.value)}
                placeholder="Ex: 1500"
                className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-white text-[#0F172A]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-[#E2E8F0] text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Confirmar Sincronização Mock
            </button>
          </div>
        </form>
      )}

      {/* Filter search bar */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl flex items-center shadow-sm">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Pesquisar por contas de clientes cadastradas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-xs tracking-wide text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white"
          />
        </div>
      </div>

      {/* Grid of Accounts and their status indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((item) => {
          const isMeta = item.platform === 'facebook';
          const isError = item.status === 'error';
          const isPaused = item.status === 'paused';
          const isDisconnected = item.status === 'disconnected';

          return (
            <div 
              key={item.id} 
              className={`bg-white rounded-2xl border ${
                isError 
                  ? 'border-red-200 bg-red-50/10' 
                  : isPaused 
                    ? 'border-amber-200' 
                    : 'border-[#E2E8F0]'
              } shadow-sm overflow-hidden flex flex-col justify-between`}
            >
              {/* Header inside card */}
              <div className="p-5 border-b border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  {isMeta ? (
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[10px] font-bold">
                      <Facebook className="w-3 h-3 fill-current" />
                      <span>Meta Ads</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-full text-[10px] font-bold">
                      <Chrome className="w-3 h-3 text-sky-600" />
                      <span>Google Ads</span>
                    </span>
                  )}

                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    isError 
                      ? 'bg-red-100 text-red-700' 
                      : isPaused 
                        ? 'bg-amber-100 text-amber-700' 
                        : isDisconnected 
                          ? 'bg-slate-100 text-slate-500' 
                          : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      isError ? 'bg-red-500' : isPaused ? 'bg-amber-500' : isDisconnected ? 'bg-slate-400' : 'bg-emerald-500'
                    }`} />
                    {item.status === 'active' ? 'Ativo' : item.status === 'paused' ? 'Pausado' : item.status === 'disconnected' ? 'Desconectado' : 'Requer Atenção'}
                  </span>
                </div>

                <div className="pt-1">
                  <h3 className="font-extrabold text-sm text-[#0F172A] line-clamp-1">{item.name}</h3>
                  <p className="text-[10px] text-[#64748B] mt-0.5">Sincronizado pela última vez: {item.lastSync}</p>
                </div>
              </div>

              {/* Middle Metrics */}
              <div className="px-5 py-4 bg-[#F8FAFC]/75 grid grid-cols-2 gap-4 border-b border-[#E2E8F0]">
                <div>
                  <span className="text-[9px] text-[#64748B] uppercase tracking-wider block">Campanhas Ativas</span>
                  <span className="text-sm font-extrabold text-[#0F172A] mt-0.5 block">{item.activeCampaigns}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#64748B] uppercase tracking-wider block">Gasto Diário</span>
                  <span className="text-sm font-extrabold text-[#0F172A] mt-0.5 block">
                    {item.spend24h > 0 ? `R$ ${item.spend24h.toFixed(2)}` : 'R$ 0,00'}
                  </span>
                </div>
              </div>

              {/* Warning box inside card if account is in error */}
              {isError && (
                <div className="mx-4 mt-3 p-2.5 bg-red-50 border border-red-100 text-red-700 rounded-lg text-[9px] leading-normal flex items-start space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>Anúncios reprovados ou problemas de cobrança estão prejudicando a saúde de canais desta conta. Verifique a lista de Alertas.</span>
                </div>
              )}

              {/* Lower actions toolbar */}
              <div className="p-3 bg-white flex items-center justify-between">
                <button
                  onClick={() => onToggleStatus(item.id)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    isPaused 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' 
                      : 'bg-[#F2F4F7] hover:bg-[#E4E7EC] text-amber-700'
                  }`}
                  title={isPaused ? 'Ativar Rastreamento' : 'Pausar Monitoramento'}
                >
                  {isPaused ? (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Ativar</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Desativar</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onDeleteAccount(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Vincular fora do sistema"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredAccounts.length === 0 && (
          <div className="col-span-full bg-white border border-[#E2E8F0] p-12 text-center rounded-2xl">
            <Layers className="w-12 h-12 text-[#64748B] mx-auto opacity-50 mb-4" />
            <span className="font-bold text-sm text-[#0F172A] block">Nenhuma conta encontrada</span>
            <p className="text-xs text-[#64748B] mt-1 leading-normal max-w-sm mx-auto">
              Nenhuma conta casa com "{searchTerm}". Submeta um novo cadastro fictício para povoar o seu painel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
