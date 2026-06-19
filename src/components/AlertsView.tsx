import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MessageSquare, 
  Copy, 
  Check, 
  RefreshCw, 
  Send, 
  AlertOctagon, 
  CheckCircle2, 
  Plus, 
  BookOpen, 
  Sparkles,
  Smartphone,
  Trash2,
  ListFilter
} from 'lucide-react';
import { Alert, Platform, AlertSeverity } from '../types';
import { ERROR_TEMPLATES, generateWhatsAppAlert } from '../services/mockData';

interface AlertsViewProps {
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
  onAddCustomAlert: (alert: Alert) => void;
  onClearAlerts: () => void;
}

export default function AlertsView({ alerts, onResolveAlert, onAddCustomAlert, onClearAlerts }: AlertsViewProps) {
  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Playground States
  const [selectedTemplateId, setSelectedTemplateId] = useState(ERROR_TEMPLATES[0].id);
  const [playgroundPlatform, setPlaygroundPlatform] = useState<Platform>('facebook');
  const [playgroundAccount, setPlaygroundAccount] = useState('Vanguard Ecommerce - Principal');
  const [playgroundCustomLog, setPlaygroundCustomLog] = useState(ERROR_TEMPLATES[0].errorLog);
  const [playgroundTitle, setPlaygroundTitle] = useState(ERROR_TEMPLATES[0].title);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    message: string;
    technicalReason: string;
    recommendation: string;
  } | null>(null);
  const [playgroundCopied, setPlaygroundCopied] = useState(false);

  const filteredAlerts = alerts.filter(item => {
    const sevMatch = severityFilter === 'all' || item.severity === severityFilter;
    const statMatch = statusFilter === 'all' || 
                      (statusFilter === 'active' && item.status === 'active') || 
                      (statusFilter === 'resolved' && item.status === 'resolved');
    return sevMatch && statMatch;
  });

  const handleCopyAlert = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTemplateChange = (id: string) => {
    const tpl = ERROR_TEMPLATES.find(t => t.id === id);
    if (tpl) {
      setSelectedTemplateId(id);
      setPlaygroundPlatform(tpl.platform);
      setPlaygroundCustomLog(tpl.errorLog);
      setPlaygroundTitle(tpl.title);
      setGeneratedResult(null);
    }
  };

  const handleTriggerMockAnalysis = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const output = generateWhatsAppAlert(
        playgroundPlatform,
        playgroundTitle,
        playgroundAccount,
        playgroundCustomLog
      );
      setGeneratedResult(output);
      setIsGenerating(false);
      setPlaygroundCopied(false);
    }, 600);
  };

  const handleAddGeneratedToGlobalQueue = () => {
    if (!generatedResult) return;

    let sev: AlertSeverity = 'critical';
    if (playgroundTitle.toLowerCase().includes('cpa') || playgroundTitle.toLowerCase().includes('custo') || playgroundCustomLog.toLowerCase().includes('warning')) {
      sev = 'warning';
    }

    const nAlert: Alert = {
      id: 'alt_' + Date.now(),
      title: playgroundTitle,
      accountName: playgroundAccount,
      platform: playgroundPlatform,
      severity: sev,
      timestamp: 'Agora mesmo',
      status: 'active',
      message: `Anúncio reprovado na conta devido a erro técnico de monitoramento automático.`,
      technicalReason: generatedResult.technicalReason,
      recommendation: generatedResult.recommendation
    };

    onAddCustomAlert(nAlert);
    
    // Quick success action indicator
    alert('Alerta inserido na fila de ocorrências com sucesso!');
  };

  const handleCopyPlaygroundResult = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult.message);
    setPlaygroundCopied(true);
    setTimeout(() => setPlaygroundCopied(false), 2000);
  };

  return (
    <div id="alerts-view-root" className="space-y-8">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Ocorrências e Alertas</h1>
          <p className="text-xs text-[#64748B]">
            Histórico completo de incidentes detectados nas APIS vinculadas com replicação WhatsApp.
          </p>
        </div>
        <div>
          <button 
            onClick={onClearAlerts}
            className="text-xs font-bold bg-white text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            Limpar Histórico Resolvido
          </button>
        </div>
      </div>

      {/* CORE PART 1: THE INTERACTIVE AI WHATSAPP ALERT STUDIO GRAPHIC PLAYGROUND */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        {/* Play header banner */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-5 text-white flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 fill-current text-sky-200 animate-pulse" />
              <h2 className="font-sans font-bold text-base tracking-tight">Laboratório de Alertas de Tráfego por IA</h2>
            </div>
            <p className="text-xs text-blue-100 opacity-90">Simulador oficial de análise técnica de anúncios com formatação otimizada para WhatsApp celular.</p>
          </div>
          <span className="bg-white/15 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Modo Editor</span>
        </div>

        {/* Content body split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E2E8F0]">
          
          {/* Left Column: Log inputs and template triggers */}
          <div className="lg:col-span-7 p-6 space-y-5">
            <h3 className="font-bold text-xs text-[#0F172A] uppercase tracking-wider flex items-center">
              <BookOpen className="w-4 h-4 text-[#2563EB] mr-2" />
              Passo 1: Selecionar Log Operacional das APIs
            </h3>

            {/* Template selector pills */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#64748B] uppercase">Templates de Erro de Tráfego:</label>
              <div className="flex flex-wrap gap-2">
                {ERROR_TEMPLATES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTemplateChange(item.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      selectedTemplateId === item.id 
                        ? 'bg-blue-50 text-[#2563EB] border-[#2563EB] shadow-sm' 
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.title.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform & Account Selection */}
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#64748B] mb-1">Plataforma Origem</label>
                <select 
                  value={playgroundPlatform}
                  onChange={(e) => setPlaygroundPlatform(e.target.value as Platform)}
                  className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-white text-[#0F172A]"
                >
                  <option value="facebook">Meta Ads</option>
                  <option value="google">Google Ads</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#64748B] mb-1">Nome do Cliente/Conta</label>
                <input 
                  type="text"
                  value={playgroundAccount}
                  onChange={(e) => setPlaygroundAccount(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-white text-[#0F172A]"
                />
              </div>
            </div>

            {/* Title override */}
            <div className="text-xs font-semibold">
              <label className="block text-[10px] uppercase font-bold text-[#64748B] mb-1">Título do Erro Detectado</label>
              <input 
                type="text"
                value={playgroundTitle}
                onChange={(e) => setPlaygroundTitle(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-xl p-2.5 bg-white text-[#0F172A]"
              />
            </div>

            {/* Large Log editor */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-[#64748B] mb-1">Log Cru Retornado pela API (JSON / Erro Criptografado)</label>
              <textarea
                value={playgroundCustomLog}
                onChange={(e) => setPlaygroundCustomLog(e.target.value)}
                rows={4}
                className="w-full border border-[#E2E8F0] rounded-xl p-3 font-mono text-xs bg-slate-900 text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                placeholder="Exemplo de payload bruto retornado pelo log do Facebook Ads..."
              />
            </div>

            {/* Submit Action keys */}
            <div className="pt-2 flex space-x-3">
              <button
                type="button"
                onClick={handleTriggerMockAnalysis}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 px-4 rounded-xl font-bold text-xs tracking-wide shadow-md shadow-blue-500/10 transition cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processando Status Técnico...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-sky-200 fill-current" />
                    <span>Analisar Erro e Gerar Alerta</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic celular render outputs */}
          <div className="lg:col-span-5 p-6 bg-[#F8FAFC] flex flex-col justify-between items-center text-xs">
            
            {!generatedResult ? (
              <div id="playground-empty-state" className="h-full flex flex-col justify-center items-center text-center p-8 text-slate-400 space-y-3">
                <Smartphone className="w-12 h-12 stroke-1 opacity-60" />
                <span className="font-bold text-xs text-[#0F172A]">Simulador Celular de Alertas</span>
                <p className="text-[11px] leading-relaxed max-w-[240px]">
                  Clique em <strong>"Analisar Erro e Gerar Alerta"</strong> para simular a resposta imediata de nossa IA disparada à equipe.
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center space-y-4 animate-fade-in">
                
                {/* Simulated Phone UI block */}
                <div className="w-[280px] bg-white border-4 border-slate-900 rounded-[2rem] shadow-lg relative overflow-hidden flex flex-col h-[380px]">
                  
                  {/* Phone Notch */}
                  <div className="h-4 bg-slate-900 flex justify-center items-center">
                    <div className="w-16 h-2 bg-slate-900 rounded-b" />
                  </div>

                  {/* Header of mock chat */}
                  <div className="bg-[#075E54] py-2 px-3 text-white flex items-center justify-between text-[10px]">
                    <span className="font-bold">AlertAds Live API</span>
                    <span className="font-sans text-[8px] bg-[#14B8A6] px-1 rounded-sm uppercase tracking-wide">Ativo</span>
                  </div>

                  {/* Message body */}
                  <div className="flex-1 overflow-y-auto bg-[#ECE5DD] p-3 space-y-3 font-mono text-[9px] leading-relaxed text-[#0F172A]">
                    <div className="bg-[#DCF8C6] p-3 rounded-lg shadow-sm max-w-[94%] border border-[#c3ebaa] relative font-sans">
                      <div className="whitespace-pre-line text-[#0F172A] leading-[1.3]">
                        {generatedResult.message}
                      </div>
                      <div className="text-right text-[7px] text-slate-500 mt-1">11:58 ✓✓</div>
                      {/* tail */}
                      <div className="absolute left-0 top-2 -ml-1.5 w-2 h-2 bg-[#DCF8C6] transform rotate-45 border-l border-b border-[#c3ebaa]/30" />
                    </div>
                  </div>
                </div>

                {/* Companion Action Buttons */}
                <div className="grid grid-cols-2 gap-2 w-full pt-1">
                  <button
                    type="button"
                    onClick={handleCopyPlaygroundResult}
                    className="flex justify-center items-center space-x-1 py-2.5 border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 font-bold tracking-wide rounded-xl shadow-sm text-[10px] transition cursor-pointer"
                  >
                    {playgroundCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copiar Mensagem</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleAddGeneratedToGlobalQueue}
                    className="flex justify-center items-center space-x-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide rounded-xl shadow-md text-[10px] transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Injetar na Fila</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CORE PART 2: THE CURRENT ALERTS LOG LIST */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        
        {/* Table Filters header */}
        <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-sm text-[#0F172A]">Fila Geral de Incidentes</h3>
            <p className="text-[10px] text-[#64748B]">Mecanismo de triagem de erros de anúncios ativos</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            {/* Severity filtering filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Severidade:</span>
              <select 
                value={severityFilter} 
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="border border-[#E2E8F0] rounded-lg p-1.5 bg-white text-slate-700"
              >
                <option value="all">Todas</option>
                <option value="critical">🔴 Crítico</option>
                <option value="warning">⚠️ Aviso</option>
                <option value="info">🟢 Info</option>
              </select>
            </div>

            {/* Status filtering filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Status:</span>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border border-[#E2E8F0] rounded-lg p-1.5 bg-white text-slate-700"
              >
                <option value="all">Todos</option>
                <option value="active">Pendentes</option>
                <option value="resolved">Resolvidos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Alerts List Render */}
        <div className="divide-y divide-[#E2E8F0]">
          {filteredAlerts.map((item) => {
            const isCritical = item.severity === 'critical';
            const isWarning = item.severity === 'warning';
            const formattedPlatform = item.platform === 'facebook' ? 'Meta Ads' : 'Google Ads';
            
            const rawWhatsAppText = `${isCritical ? '🔴' : '⚠️'} *ALERTADS • TRÁFEGO INTERROMPIDO*

*Conta:* ${item.accountName}
*Origem:* ${formattedPlatform}
*Problema:* ${item.title}

*Motivo Técnico:*
${item.technicalReason}

*Solução Imediata:*
👉 ${item.recommendation}`;

            return (
              <div 
                key={item.id} 
                className={`p-5 transition-colors hover:bg-slate-50/50 flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                  item.status === 'resolved' ? 'opacity-60 bg-slate-50/20' : ''
                }`}
              >
                
                {/* Information side */}
                <div className="space-y-3 max-w-3xl text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      isCritical 
                        ? 'bg-red-50 text-red-700 border border-red-100' 
                        : isWarning 
                          ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {isCritical ? '🔴 CRÍTICO' : isWarning ? '⚠️ AVISO' : '🟢 INFO'}
                    </span>

                    <span className="text-[#64748B] font-mono text-[10px]">{item.timestamp}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[#0F172A] font-bold">{item.accountName} ({formattedPlatform})</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-[#0F172A] text-sm leading-tight">{item.title}</h4>
                    <p className="text-slate-600 leading-normal">{item.message}</p>
                  </div>

                  {/* Diagnostic details drawers */}
                  <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2 mt-2">
                    <div>
                      <strong className="text-[10px] text-[#2563EB] uppercase tracking-wider block">Motivo Técnico:</strong>
                      <p className="text-[#0F172A] mt-0.5 leading-relaxed">{item.technicalReason}</p>
                    </div>
                    <div className="pt-2 border-t border-[#E2E8F0]">
                      <strong className="text-[10px] text-[#14B8A6] uppercase tracking-wider block">Ação Comercial Recomendada:</strong>
                      <p className="text-[#0F172A] mt-0.5 leading-relaxed font-semibold">👉 {item.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Quick actions box on the right */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyAlert(item.id, rawWhatsAppText)}
                    className="flex justify-center items-center space-x-1.5 border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-slate-700 font-bold px-3 py-2 rounded-xl text-[10px] tracking-wide transition cursor-pointer shadow-sm w-full md:w-36"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copiada Msg!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copiar WhatsApp</span>
                      </>
                    )}
                  </button>

                  {item.status === 'active' ? (
                    <button
                      onClick={() => onResolveAlert(item.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-[10px] tracking-wide shadow transition cursor-pointer w-full md:w-36 text-center"
                    >
                      Anotar Resolvido
                    </button>
                  ) : (
                    <span className="text-[#14B8A6] font-bold text-[10px] px-3 py-2 border border-emerald-100 bg-emerald-50 rounded-xl flex items-center justify-center w-full md:w-36">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Resolvido
                    </span>
                  )}
                </div>

              </div>
            );
          })}

          {filteredAlerts.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-60 mb-3" />
              <span className="font-bold text-sm text-[#0F172A]">Tudo Limpo!</span>
              <p className="text-xs text-[#64748B] mt-1">Nenhum alerta pendente com esses filtros selecionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
