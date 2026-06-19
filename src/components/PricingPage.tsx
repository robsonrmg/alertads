import React, { useState } from 'react';
import { Check, ShieldAlert, Zap, Globe, MessageSquare, Shield, HelpCircle } from 'lucide-react';
import { Page } from '../types';

interface PricingPageProps {
  onNavigate: (page: Page) => void;
}

export default function PricingPage({ onNavigate }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter Solo',
      priceMonthly: 97,
      priceYearly: 77,
      description: 'Ideal para afiliados e gestores solo que cuidam de poucas contas.',
      features: [
        'Monitoramento de até 3 contas de anúncios',
        'Varreduras a cada 15 minutos em Meta/Google',
        '1 WhatsApp cadastrado para recebimento',
        'Status do pixel e faturamento',
        'Limites de orçamento diário',
        'Suporte padrão por email'
      ],
      cta: 'Começar Agora',
      popular: false,
      badge: 'Básico'
    },
    {
      name: 'Squad Pro',
      priceMonthly: 197,
      priceYearly: 147,
      description: 'Perfeito para agências em crescimento com equipes compartilhadas.',
      features: [
        'Monitoramento de até 15 contas de anúncios',
        'Varreduras prioritárias a cada 5 minutos',
        'Até 3 WhatsApps cadastrados em paralelo',
        'Diagnósticos completos de reprovados com IA',
        'Mapeamento avançado do Pixel de conversão',
        'Painel dinâmico administrativo',
        'Suporte prioritário via WhatsApp'
      ],
      cta: 'Criar Conta Pro',
      popular: true,
      badge: 'Mais Recomendado'
    },
    {
      name: 'Enterprise Scale',
      priceMonthly: 397,
      priceYearly: 297,
      description: 'Construído para grandes agências de lançamento e escala milionária.',
      features: [
        'Contas de anúncios ILIMITADAS',
        'Varreduras instantâneas abaixo de 5 minutos',
        'WhatsApps ILIMITADOS de destinatários',
        'Regras personalizadas de alertas (CPA, CTR, KPI)',
        'Integração nativa de Webhook para múltiplos CRMs',
        'Acesso à API oficial do AlertAds',
        'Gerente de Contas dedicado (SLAs exclusivos)'
      ],
      cta: 'Entrar em Contato',
      popular: false,
      badge: 'Alta Performance'
    }
  ];

  return (
    <div id="pricing-page-root" className="min-h-screen bg-[#F8FAFC] py-16 px-6 font-sans">
      
      {/* Navigation Header mockup */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-16">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="p-2 bg-[#2563EB] text-white rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-[#0F172A]">Alert<span className="text-[#2563EB]">Ads</span></span>
        </div>
        <button 
          onClick={() => onNavigate('landing')}
          className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] bg-white rounded-lg px-4 py-2 transition shadow-sm"
        >
          Voltar ao Início
        </button>
      </div>

      <div className="max-w-5xl mx-auto text-center mb-12 space-y-4">
        <span className="text-xs font-bold text-[#2563EB] bg-[#2563EB]/5 px-3 py-1.5 rounded-full uppercase tracking-widest">Planos de Assinatura</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A]">
          Proteja seu orçamento sem custos absurdos
        </h1>
        <p className="text-[#64748B] text-lg max-w-xl mx-auto">
          Um anúncio pausado por 2 horas custa muito mais que a nossa assinatura mensal Pro. Escolha o ideal para o tamanho de sua operação.
        </p>

        {/* Toggle Billing Period */}
        <div className="flex justify-center items-center space-x-4 pt-6">
          <span className={`text-sm font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>Mensal</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 rounded-full bg-[#E2E8F0] p-1 flex items-center transition relative focus:outline-none"
          >
            <div className={`w-4 h-4 rounded-full bg-[#2563EB] shadow transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-semibold transition-colors flex items-center ${billingCycle === 'yearly' ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
            Anual <span className="ml-1.5 px-2 py-0.5 bg-[#14B8A6] text-white text-[10px] font-bold rounded-full">Economize 20%</span>
          </span>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-6">
        {plans.map((p, idx) => {
          const price = billingCycle === 'monthly' ? p.priceMonthly : p.priceYearly;
          return (
            <div 
              key={idx} 
              className={`bg-white rounded-3xl border ${
                p.popular 
                  ? 'border-2 border-[#2563EB] shadow-xl relative scale-100 lg:scale-[1.03] z-10' 
                  : 'border-[#E2E8F0] shadow-sm hover:shadow-lg'
              } p-8 flex flex-col justify-between transition-all duration-300`}
            >
              <div>
                {/* Popular Badge */}
                <div className="flex justify-between items-center mb-6">
                  <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    p.popular ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-[#64748B]'
                  }`}>
                    {p.badge}
                  </span>
                  {p.popular && (
                    <span className="flex items-center text-xs font-bold text-[#14B8A6]">
                      <Zap className="w-3.5 h-3.5 fill-current mr-1" />
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[#0F172A]">{p.name}</h3>
                <p className="text-xs text-[#64748B] mt-2 leading-relaxed min-h-[36px]">{p.description}</p>

                {/* Price Display */}
                <div className="my-6 flex items-baseline">
                  <span className="text-sm font-bold text-[#64748B] mr-1">R$</span>
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">{price}</span>
                  <span className="text-sm text-[#64748B] ml-2">/mês</span>
                </div>

                <div className="border-t border-[#E2E8F0] my-6" />

                {/* Features list */}
                <ul className="space-y-3.5 text-xs">
                  {p.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2.5">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${p.popular ? 'text-[#2563EB]' : 'text-[#14B8A6]'}`} />
                      <span className="text-slate-600 font-medium leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA trigger */}
              <div className="mt-8">
                <button
                  onClick={() => onNavigate('register')}
                  className={`w-full py-3 px-4 rounded-xl font-bold tracking-wide text-xs transition duration-250 cursor-pointer ${
                    p.popular
                      ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-blue-500/20'
                      : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A]'
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security guarantees */}
      <div className="max-w-3xl mx-auto text-center mt-20 p-6 bg-white border border-[#E2E8F0] rounded-2xl">
        <div className="flex flex-col sm:flex-row justify-around items-center gap-6">
          <div className="flex items-center space-x-3 text-left">
            <Shield className="w-8 h-8 text-[#14B8A6] shrink-0" />
            <div>
              <h4 className="font-bold text-xs text-[#0F172A]">Garantia de 7 Dias</h4>
              <p className="text-[10px] text-[#64748B]">Cancele quando quiser com apenas um clique.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-left">
            <MessageSquare className="w-8 h-8 text-[#2563EB] shrink-0" />
            <div>
              <h4 className="font-bold text-xs text-[#0F172A]">Faturamento Transparente</h4>
              <p className="text-[10px] text-[#64748B]">Boleto empresarial, Pix ou cartão corporativo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
