import React from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  AlertOctagon, 
  CheckCircle2, 
  ExternalLink,
  Smartphone,
  Facebook,
  Chrome,
  Terminal,
  Copy,
  Check,
  Clock,
  Play
} from 'lucide-react';
import { AdAccount, Alert, Page } from '../types';
import { checkAllMonitors } from '../services/monitoring/check-monitor';

interface DashboardViewProps {
  accounts: AdAccount[];
  alerts: Alert[];
  onNavigate: (page: Page) => void;
  onResolveAlert: (id: string) => void;
}

export default function DashboardView({ accounts, alerts, onNavigate, onResolveAlert }: DashboardViewProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [running, setRunning] = React.useState(false);
  const [lastRun, setLastRun] = React.useState<string>(() => {
    return localStorage.getItem('alertads_last_run') || 'Aguardando primeira execução';
  });
  const [nextRun, setNextRun] = React.useState<string>(() => {
    return localStorage.getItem('alertads_next_run') || 'Aguardando início';
  });
  const [cronStatus, setCronStatus] = React.useState<string>('Ativo');

  const handleTriggerCron = async () => {
    setRunning(true);
    setCronStatus('Verificando...');
    try {
      const result = await checkAllMonitors();
      const nowStr = new Date().toLocaleTimeString('pt-BR');
      const nextStr = new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString('pt-BR');
      setLastRun(nowStr);
      setNextRun(`${nextStr} (Em 5 min)`);
      localStorage.setItem('alertads_last_run', nowStr);
      localStorage.setItem('alertads_next_run', `${nextStr} (Em 5 min)`);
      
      if (result.success) {
        const anyAnomalies = result.results.filter(r => r.alertGenerated).length;
        if (anyAnomalies > 0) {
          setCronStatus(`🔴 Instável (${anyAnomalies} alertas)`);
        } else {
          setCronStatus('🟢 Saudável');
        }
        window.location.reload(); 
      } else {
        setCronStatus('🟢 Simulação Offline');
      }
    } catch (e: any) {
      setCronStatus('🔴 Falha');
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = activeAlerts.filter(a => a.severity === 'warning').length;
  const activeAccountsCount = accounts.filter(acc => acc.status === 'active').length;
  const errorAccountsCount = accounts.filter(acc => acc.status === 'error').length;
  
  const totalSpend24h = accounts.reduce((acc, curr) => acc + curr.spend24h, 0);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="dashboard-view-root" className="space-y-6">
      
      {/* Title Header area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Painel de Operações</h1>
          <p className="text-xs text-[#64748B]">
            Status consolidado de suas campanhas de anúncios e envio automático de alertas para o WhatsApp.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-ping" />
            Robô AlertAds Vigilante Ativo
          </span>
          <span className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 font-medium font-mono text-[11px]">
            Último Sync: Há 5s
          </span>
        </div>
      </div>

      {/* Painel do Motor de Varredura Automatizada (Etapa 6 do projeto AlertAds) */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-100 rounded text-[9px] font-extrabold uppercase tracking-wider">
              Motor Vigilante (Etapa 6)
            </span>
            <h3 className="font-extrabold text-[#0F172A] text-sm">Status de Varredura do Robô Vigilante</h3>
            <p className="text-[11px] text-[#64748B]">
              Seu tráfego é analisado periodicamente em segundo plano. Use o botão abaixo para simular ou disparar a rotina agora.
            </p>
          </div>
          
          <button
            onClick={handleTriggerCron}
            disabled={running}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${running ? 'animate-pulse' : ''}`} />
            <span>{running ? 'Rodando Varredura...' : 'Disparar Varredura (Cron)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200/60 text-xs text-[#0F172A]">
          <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 font-medium">Última Execução:</span>
            <strong className="text-slate-900 font-mono font-bold text-right">{lastRun}</strong>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 font-medium">Próxima Execução:</span>
            <strong className="text-blue-600 font-mono font-bold animate-pulse text-right">{nextRun}</strong>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 font-medium">Status do Monitoramento:</span>
            <span className="inline-flex items-center font-extrabold text-right justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
              {cronStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Critical Highlight Alert Banner if active criticals exist */}
      {criticalCount > 0 && (
        <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-2xl p-4 flex items-start space-x-3.5 shadow-sm animate-pulse">
          <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-[#991B1B]">Bloqueio/Reprovação Urgente Detectada</h4>
            <p className="text-red-700 mt-1 leading-relaxed">
              Existem <strong>{criticalCount} pendências gravíssimas</strong> travando a conversão de canais chave do seu tráfego pago. Alertas já foram gerados e encaminhados para os responsáveis via WhatsApp.
            </p>
            <button 
              onClick={() => onNavigate('alerts')}
              className="mt-2.5 font-bold text-red-600 hover:text-red-800 underline inline-flex items-center space-x-1"
            >
              <span>Resolver Dependências Agora</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Primary Indicator Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Active Accounts */}
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Contas Monitoradas</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-bold text-[#0F172A]">{accounts.length}</span>
              <span className="text-[10px] font-semibold text-[#14B8A6]">Ativas</span>
            </div>
            <span className="text-[10px] text-[#64748B] block mt-1">{activeAccountsCount} em escala normal • {errorAccountsCount} com falhas</span>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Investment 24h */}
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Gasto Estimado (24h)</span>
            <div className="flex items-baseline space-x-0.5">
              <span className="text-[13px] font-bold text-[#0F172A]">R$</span>
              <span className="text-2xl font-bold text-[#0F172A]">
                {totalSpend24h.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-[#14B8A6] block mt-1">✓ Orçamento Geral Integrado</span>
          </div>
          <div className="w-10 h-10 bg-teal-50 text-[#14B8A6] rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Pending Alerts */}
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Alertas Pendentes</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-bold text-red-600">{activeAlerts.length}</span>
              {criticalCount > 0 && (
                <span className="text-[10px] bg-red-100 text-[#991B1B] px-1.5 py-0.5 rounded font-bold">
                  {criticalCount} GRÁVEIS
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#64748B] block mt-1">{warningCount} avisos moderados de performance</span>
          </div>
          <div className="w-10 h-10 bg-red-50 text-[#EF4444] rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Deliveries count */}
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Entregas no WhatsApp</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-bold text-[#0F172A]">1.482</span>
              <span className="text-[10px] font-semibold text-emerald-600">100% Taxa</span>
            </div>
            <span className="text-[10px] text-[#64748B] block mt-1">Nenhum envio rejeitado pelo gateway</span>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Alerts History Line Graph (Custom design SVG area chart) */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm lg:col-span-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Frequência de Ocorrências e Bloqueios</h3>
              <p className="text-[10px] text-[#64748B]">Mapeamento de desvios operacionais detectados por dia (Análise semanal)</p>
            </div>
            <div className="flex items-center space-x-3 text-[10px] font-semibold">
              <span className="flex items-center text-red-600">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-1" />
                Críticos
              </span>
              <span className="flex items-center text-amber-500">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full mr-1" />
                Avisos
              </span>
            </div>
          </div>

          {/* SVG Area Line Chart */}
          <div className="w-full h-[180px] relative">
            <svg viewBox="0 0 500 150" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                {/* Gradients */}
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" />

              {/* Area Under Lines (Critical) */}
              <path 
                d="M 10,130 Q 90,90 170,110 T 330,40 T 490,50 L 500,150 L 0,150 Z" 
                fill="url(#colorCritical)" 
                opacity="1"
              />

              {/* Area Under Lines (Warning) */}
              <path 
                d="M 10,140 Q 90,120 170,70 T 330,95 T 490,120 L 500,150 L 0,150 Z" 
                fill="url(#colorWarning)" 
                opacity="0.8"
              />

              {/* Lines */}
              {/* Critical trend line */}
              <path 
                d="M 10,130 Q 90,90 170,110 T 330,40 T 490,50" 
                fill="none" 
                stroke="#EF4444" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
              
              {/* Warning trend line */}
              <path 
                d="M 10,140 Q 90,120 170,70 T 330,95 T 490,120" 
                fill="none" 
                stroke="#F59E0B" 
                strokeWidth="2.5" 
                strokeDasharray="4 2"
                strokeLinecap="round"
              />

              {/* Key points markers */}
              <circle cx="170" cy="110" r="4.5" fill="#EF4444" stroke="#FFF" strokeWidth="2" />
              <circle cx="330" cy="40" r="4.5" fill="#EF4444" stroke="#FFF" strokeWidth="2" />
              <circle cx="490" cy="50" r="4.5" fill="#EF4444" stroke="#FFF" strokeWidth="2" />
              
              <circle cx="170" cy="70" r="3.5" fill="#F59E0B" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="330" cy="95" r="3.5" fill="#F59E0B" stroke="#FFF" strokeWidth="1.5" />
            </svg>

            {/* Bottom labels */}
            <div className="flex justify-between text-[9px] text-[#64748B] mt-2 font-mono">
              <span>Seg (15/06)</span>
              <span>Ter (16/06)</span>
              <span>Qua (17/06)</span>
              <span>Qui (18/06)</span>
              <span>Hoje (19/06)</span>
            </div>
          </div>
        </div>

        {/* Right: Discrepancies and active channels (Circle metric status) */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">Canais Conectados</h3>
            <p className="text-[10px] text-[#64748B] mb-5">Sincronização atual com as redes de tráfego</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Meta Ads Integration status */}
            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-100 text-[#2563EB] rounded-lg">
                  <Facebook className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A] text-xs">Meta Ads (Facebook)</h4>
                  <span className="text-[10px] text-[#64748B]">3 contas ativas integradas</span>
                </div>
              </div>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>

            {/* Google Ads Integration status */}
            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
                  <Chrome className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A] text-xs">Google Ads API</h4>
                  <span className="text-[10px] text-[#64748B]">2 contas ativas integradas</span>
                </div>
              </div>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            </div>

            {/* TikTok Ads Integration status */}
            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl opacity-60">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A] text-xs">TikTok Ads API</h4>
                  <span className="text-[10px] text-[#64748B]">Nenhuma conta vinculada</span>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('settings')}
                className="text-[10px] font-bold text-[#2563EB] hover:underline"
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Alerts Queue & Quick copy list */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">Últimos Alertas Expedidos</h3>
            <p className="text-[10px] text-[#64748B]">Status das reprovações enviadas aos celulares dos responsáveis</p>
          </div>
          <button 
            id="view-all-alerts-btn"
            onClick={() => onNavigate('alerts')}
            className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
          >
            Ver Todos ({alerts.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-5">Criticidade</th>
                <th className="py-3.5 px-5">Conta / Origem</th>
                <th className="py-3.5 px-5">Diagnóstico Técnico</th>
                <th className="py-3.5 px-5">Data/Hora</th>
                <th className="py-3.5 px-5">WhatsApp</th>
                <th className="py-3.5 px-5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-medium text-[#0F172A]">
              {alerts.slice(0, 3).map((item) => {
                const isCritical = item.severity === 'critical';
                const isWarning = item.severity === 'warning';
                const formattedPlatform = item.platform === 'facebook' ? 'Meta Ads' : 'Google Ads';

                // WhatsApp template structure
                const formattedWhatsAppText = `${isCritical ? '🔴' : '⚠️'} *ALERTADS • TRÁFEGO INTERROMPIDO*

*Conta:* ${item.accountName}
*Origem:* ${formattedPlatform}
*Problema:* ${item.title}

*Motivo Técnico:*
${item.technicalReason}

*Solução Imediata:*
👉 ${item.recommendation}`;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold ${
                        isCritical 
                          ? 'bg-red-50 text-red-700 border border-red-100' 
                          : isWarning 
                            ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        {item.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold">{item.accountName}</div>
                      <span className="text-[10px] text-[#64748B]">{formattedPlatform}</span>
                    </td>
                    <td className="py-4 px-5 max-w-sm">
                      <div className="line-clamp-1 font-semibold">{item.title}</div>
                      <p className="text-[10px] text-[#64748B] line-clamp-1 mt-0.5">{item.message}</p>
                    </td>
                    <td className="py-4 px-5 text-[#64748B] text-[11px] font-mono whitespace-nowrap">
                      {item.timestamp}
                    </td>
                    <td className="py-4 px-5">
                      {item.status === 'active' ? (
                        <button
                          onClick={() => handleCopyMessage(item.id, formattedWhatsAppText)}
                          className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-[#E2E8F0] border border-[#E2E8F0] px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 transition"
                          title="Copiar texto formatado para o WhatsApp"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600 font-bold" />
                              <span className="text-emerald-700 font-semibold font-sans">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span className="font-sans">Copiar AlertMsg</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#14B8A6] font-bold flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Disparado ✓
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      {item.status === 'active' ? (
                        <button
                          onClick={() => onResolveAlert(item.id)}
                          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 hover:border-emerald-250 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-[10px] tracking-wide transition cursor-pointer"
                        >
                          Resolver
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[10px]">Resolvido</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
