import { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  ShieldAlert, 
  Zap, 
  ArrowRight, 
  Play, 
  MousePointer, 
  Smartphone, 
  Layers, 
  Lock
} from 'lucide-react';
import { Page } from '../types';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'meta' | 'google'>('meta');

  // Simulated Alert previews matching instructions
  const metaAlertMock = `🔴 *ALERTADS • ALERTA DE TRÁFEGO*

*Conta:* Vanguard Ecommerce
*Plataforma:* Meta Ads
*Problema:* Sistemas de Elisão (Video_Oferta_v3)

*O que aconteceu (Técnico):*
Uso de redirecionamento duplo no link de destino ou caracteres especiais mascarados na descrição de vendas do criativo.

*Ação recomendada imediata:*
👉 Verifique se a URL de destino possui redirecionadores ativos. Altere o texto removendo caracteres especiais redundantes ou emojis em excesso.`;

  const googleAlertMock = `🔴 *ALERTADS • ALERTA DE TRÁFEGO*

*Conta:* Nexus Leads
*Plataforma:* Google Ads
*Problema:* URL de Destino Quebrada (Error 404)

*O que aconteceu (Técnico):*
A página de vendas está retornando um código de erro 404. O Google Ads pausou o anúncio preventivamente.

*Ação recomendada imediata:*
👉 Corrija o link no anúncio ou faça um redirecionamento 301 caso a URL antiga tenha sido alterada pela equipe de design.`;

  return (
    <div id="landing-page-root" className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#2563EB] selection:text-white">
      {/* Premium Header */}
      <nav id="landing-nav" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="p-2.5 bg-[#2563EB] text-white rounded-xl shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-[#0F172A]">
              Alert<span className="text-[#2563EB]">Ads</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#64748B]">
            <a href="#funcionalidades" className="hover:text-[#0F172A] transition-colors">Funcionalidades</a>
            <a href="#como-funciona" className="hover:text-[#0F172A] transition-colors">Como Funciona</a>
            <button onClick={() => onNavigate('pricing')} className="hover:text-[#0F172A] transition-colors">Preços</button>
            <span className="px-2.5 py-1 bg-[#14B8A6]/10 text-[#14B8A6] rounded-full text-xs font-semibold">Ready v2.4</span>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              id="btn-login-header"
              onClick={() => onNavigate('login')} 
              className="text-sm font-semibold text-[#64748B] hover:text-[#0F172A] px-4 py-2 transition-colors"
            >
              Entrar
            </button>
            <button 
              id="btn-register-header"
              onClick={() => onNavigate('register')} 
              className="text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Criar Conta Grátis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="landing-hero" className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#38BDF8]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#2563EB]/5 border border-[#2563EB]/15 text-[#2563EB] rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide">
              <Zap className="w-3.5 h-3.5" />
              <span>Para Agências Premium e Gestores de Alto Padrão</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-[#0F172A] leading-[1.1]">
              Não perca dinheiro com <span className="text-[#2563EB] relative inline-block">contas pausadas</span> ou anúncios reprovados.
            </h1>

            <p className="text-lg text-[#64748B] max-w-xl leading-relaxed">
              O AlertAds varre suas contas do Meta Ads e Google Ads a cada 5 minutos. Ao detectar anúncios rejeitados, pixels inativos ou picos de custos, enviamos um alerta cirúrgico e imediato no WhatsApp do seu gestor com o diagnóstico técnico exato.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
              <button 
                id="btn-cta-primary"
                onClick={() => onNavigate('register')}
                className="flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-4 rounded-xl font-bold tracking-wide shadow-xl shadow-blue-500/15 transition-all text-base transform hover:-translate-y-0.5"
              >
                <span>Começar Monitoramento Agora</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button 
                id="btn-cta-secondary"
                onClick={() => onNavigate('pricing')}
                className="flex items-center justify-center space-x-2 bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] px-8 py-4 rounded-xl font-semibold transition-all text-base shadow-sm"
              >
                <span>Ver Planos de Assinatura</span>
              </button>
            </div>

            {/* Social Proof Badges */}
            <div className="pt-8 border-t border-[#E2E8F0] w-full grid grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-extrabold text-[#0F172A]">R$ 4.2M+</p>
                <p className="text-xs text-[#64748B] font-medium mt-1">Orçamento Monitorado</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#0F172A]">5 min</p>
                <p className="text-xs text-[#64748B] font-medium mt-1">Tempo Máximo de Disparo</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#0F172A]">98.7%</p>
                <p className="text-xs text-[#64748B] font-medium mt-1">Precisão Estimada</p>
              </div>
            </div>
          </div>

          {/* Right Preview Column (The Interactive Mobile Whatsapp Feed Simulator) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-[340px] sm:w-[380px] bg-white border-8 border-slate-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col h-[580px]">
              {/* Phone ear piece and camera bar */}
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 flex justify-center items-center z-20">
                <div className="w-24 h-4 bg-slate-900 rounded-b-xl" />
              </div>

              {/* Whatsapp Header */}
              <div className="bg-[#075E54] pt-8 pb-3 px-4 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-[#2563EB] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
                    AA
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-wide">AlertAds AI Bot</h4>
                    <span className="text-[10px] text-teal-100 flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#14B8A6] rounded-full mr-1.5 animate-pulse" />
                      Online • Monitorando
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                </div>
              </div>

              {/* Phone Content (Chat bubble content) */}
              <div className="flex-1 bg-[#ECE5DD] p-4 overflow-y-auto space-y-4 font-mono text-[11px] leading-relaxed">
                <div className="text-center">
                  <span className="bg-white/70 text-[#64748B] px-3 py-1 rounded-md text-[9px] shadow-sm font-sans font-medium">
                    HOJE
                  </span>
                </div>

                {/* Subtitle Selector */}
                <div className="flex justify-center space-x-2 pt-1 font-sans">
                  <button 
                    onClick={() => setActiveTab('meta')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      activeTab === 'meta' 
                        ? 'bg-[#2563EB] text-white border-[#2563EB]' 
                        : 'bg-white text-[#64748B] border-[#E2E8F0]'
                    } transition-colors`}
                  >
                    Meta Ads (Facebook)
                  </button>
                  <button 
                    onClick={() => setActiveTab('google')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      activeTab === 'google' 
                        ? 'bg-[#2563EB] text-white border-[#2563EB]' 
                        : 'bg-white text-[#64748B] border-[#E2E8F0]'
                    } transition-colors`}
                  >
                    Google Ads
                  </button>
                </div>

                {/* Real WhatsApp Styled Message Bubble */}
                <div className="bg-[#DCF8C6] hover:bg-[#d1f5b8] text-[#0F172A] p-3.5 rounded-lg shadow-md border border-[#c3ebaa] max-w-[92%] ml-1 relative transition-colors duration-200">
                  <div className="whitespace-pre-line text-[11.5px] leading-[1.5] text-[#0F172A] font-sans">
                    {activeTab === 'meta' ? metaAlertMock : googleAlertMock}
                  </div>
                  <div className="text-right text-[9px] text-[#64748B] mt-2 font-sans font-medium">
                    07:15 • Visualizado ✓✓
                  </div>
                  {/* Speech bubble tail */}
                  <div className="absolute left-0 top-3 -ml-1.5 w-3 h-3 bg-[#DCF8C6] transform rotate-45 border-l border-b border-[#c3ebaa]/30 pointer-events-none" />
                </div>

                <p className="text-center text-[#64748B]/80 text-[10px] italic font-sans px-4">
                  Simulação real do formato de leitura rápida disparado nos celulares dos gestores cadastrados.
                </p>
              </div>

              {/* Whatsapp Input bar mimic */}
              <div className="bg-[#F4F4F4] p-3 flex items-center justify-between border-t border-[#E0E0E0]">
                <div className="bg-white rounded-full flex-1 px-4 py-1.5 text-[11px] text-slate-400 font-sans shadow-sm mr-2 select-none">
                  Digite uma resposta...
                </div>
                <div className="w-8 h-8 rounded-full bg-[#075E54] text-white flex items-center justify-center shadow">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 bg-white border-y border-[#E2E8F0] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Inteligência de Tráfego</span>
            <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-[#0F172A] tracking-tight">
              Desenvolvido estritamente para agências premium
            </h2>
            <p className="text-base text-[#64748B]">
              Pare de confiar apenas em painéis estáticos de BI que sua equipe só abre uma vez por semana. Tenha monitoramento contínuo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-8 rounded-2xl relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 text-[#2563EB] rounded-xl flex items-center justify-center mb-6">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-3">Avisos em até 5 minutos</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Nossos robôs realizam varreduras a cada 5 minutos por meio de webhooks integrados ou APIs nativas para identificar faturamento rejeitado ou criativos acusados pelas diretrizes das plataformas.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-8 rounded-2xl relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-sky-100 text-[#2563EB] rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6" />
                <span className="absolute top-4 right-4 bg-[#14B8A6] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">IA</span>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-3">Diagnóstico com Linguagem Humana</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Traduzimos logs de erro criptografados do Facebook API em relatórios claros com ações corretivas em português simples, explicando exatamente onde ajustar o anúncio rejeitado.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-8 rounded-2xl relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-teal-100 text-[#14B8A6] rounded-xl flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-3">Monitoramento Multi-canal</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Cadastre e sincronize dezenas de Business Managers do Facebook Ads e Contas Corporativas do Google Ads em um único hub centralizado com relatórios consolidados em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Step Section */}
      <section id="como-funciona" className="py-20 bg-[#F8FAFC] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#14B8A6]">Processo Simples</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-extrabold text-[#0F172A] tracking-tight">
              Instalação em menos de 3 minutos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold mb-4 text-sm shadow">1</div>
              <h4 className="font-bold text-base text-[#0F172A] mb-2">Conecte suas APIs</h4>
              <p className="text-sm text-[#64748B]">
                Faça login seguro nas plataformas de anúncios em nosso painel utilizando as credenciais de desenvolvedor mockadas.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold mb-4 text-sm shadow">2</div>
              <h4 className="font-bold text-base text-[#0F172A] mb-2">Cadastre o WhatsApp</h4>
              <p className="text-sm text-[#64748B]">
                Insira o número do celular de contato dos gestores e selecione quais contas de clientes cada um monitora.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold mb-4 text-sm shadow">3</div>
              <h4 className="font-bold text-base text-[#0F172A] mb-2">Durma sem Preocupação</h4>
              <p className="text-sm text-[#64748B]">
                A partir de agora, se qualquer criativo for desaprovado ou o pixel apresentar comportamento incomum, o robô dispara o alerta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h3 className="text-sm font-semibold uppercase text-[#64748B] tracking-widest">Compatibilidade Nativa Garantida</h3>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-75">
            <span className="font-extrabold text-lg text-slate-400">Meta Business Suite</span>
            <span className="font-extrabold text-lg text-slate-400">Google Ads API</span>
            <span className="font-extrabold text-lg text-slate-400">TikTok Marketing API</span>
            <span className="font-extrabold text-lg text-slate-400">WhatsApp Cloud API</span>
          </div>
        </div>
      </section>

      {/* CTA Bottom bar */}
      <section className="bg-[#2563EB] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-700 via-transparent to-transparent opacity-60" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Pronto para blindar seu tráfego contra perdas de verba?</h2>
          <p className="text-lg text-blue-100 max-w-xl mx-auto">
            Crie sua conta agora mesmo. Sem taxas de setup e de cancelamento. Comece a testar gratuitamente hoje.
          </p>
          <div className="pt-4 flex justify-center">
            <button 
              id="btn-cta-bottom"
              onClick={() => onNavigate('register')}
              className="px-8 py-4 bg-white text-[#2563EB] font-bold rounded-xl shadow-lg hover:bg-slate-50 transition-transform transform hover:-translate-y-0.5"
            >
              Criar Painel Diagnóstico Grátis
            </button>
          </div>
        </div>
      </section>

      {/* Simple structured Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800 text-xs text-center">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex justify-center items-center space-x-2 text-white">
            <ShieldAlert className="w-5 h-5 text-[#2563EB]" />
            <span className="font-bold text-sm">AlertAds</span>
          </div>
          <p>© 2026 AlertAds. Todos os direitos reservados. Protótipo para Validação de Experiência do Usuário (SaaS).</p>
          <p className="text-[10px] text-slate-500">Desenvolvido sob diretrizes premium com o objetivo de simulação instantânea e visualização de alertas no WhatsApp.</p>
        </div>
      </footer>
    </div>
  );
}
