import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Activity, 
  Bell, 
  Sliders, 
  LogOut, 
  Menu, 
  X, 
  Smartphone,
  Facebook,
  Chrome,
  AlertOctagon,
  TrendingDown,
  Lock,
  DollarSign,
  Database,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Page, AdAccount, Alert, Platform } from './types';
import { INITIAL_ACCOUNTS, INITIAL_ALERTS } from './services/mockData';
import { 
  supabase, 
  getSupabaseConfig, 
  saveTemporaryCredentials, 
  clearTemporaryCredentials 
} from './lib/supabase/client';

// Component Imports
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import PricingPage from './components/PricingPage';
import DashboardView from './components/DashboardView';
import MonitoringView from './components/MonitoringView';
import AlertsView from './components/AlertsView';
import SettingsView from './components/SettingsView';

export default function App() {
  // Navigation Routing State
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  
  // Mobile Sidebar Drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Corporate Profile States (customized during login/signup)
  const [userEmail, setUserEmail] = useState('demo@agenciapremium.com.br');
  const [userAgency, setUserAgency] = useState('Premium Performance Corp');
  const [userPhone, setUserPhone] = useState('5511999998888');

  // Shared Data States in Reactive UI
  const [accounts, setAccounts] = useState<AdAccount[]>(INITIAL_ACCOUNTS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);

  // Supabase Configuration Status
  const { isConfigured, url: supabaseUrl } = getSupabaseConfig();
  const [dbLoading, setDbLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [inputKey, setInputKey] = useState('');

  // 1. Listen and subscribe to Supabase Auth State Change
  useEffect(() => {
    // Check current active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionUser(session.user);
        setIsLoggedIn(true);
        setUserEmail(session.user.email || 'gestor@agenciapremium.com.br');
        if (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register') {
          setCurrentPage('dashboard');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSessionUser(session.user);
        setIsLoggedIn(true);
        setUserEmail(session.user.email || 'gestor@agenciapremium.com.br');
      } else {
        setSessionUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Fetch data from Supabase DB when user connects and Supabase is configured
  useEffect(() => {
    if (isLoggedIn && sessionUser && isConfigured) {
      setDbLoading(true);
      const syncSupabaseState = async () => {
        try {
          // A. Load Profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionUser.id)
            .maybeSingle();

          if (profile) {
            setUserAgency(profile.full_name || 'Agência Premium');
          }

          // B. Load Notification Settings
          const { data: notifications } = await supabase
            .from('notification_settings')
            .select('*')
            .eq('user_id', sessionUser.id)
            .maybeSingle();

          if (notifications) {
            setUserPhone(notifications.whatsapp_number || '5511999998888');
          }

          // C. Load Monitors
          const { data: monitorsData } = await supabase
            .from('monitors')
            .select('*')
            .eq('user_id', sessionUser.id)
            .order('created_at', { ascending: false });

          if (monitorsData && monitorsData.length > 0) {
            const mappedAccounts: AdAccount[] = monitorsData.map(m => ({
              id: m.id,
              name: m.name,
              platform: (m.keyword || 'facebook') as Platform,
              status: m.is_active ? 'active' : 'paused',
              activeCampaigns: 6,
              spend24h: 420.00,
              unusualActivityCount: 0,
              lastSync: 'Sincronizado via Banco ' + new Date(m.created_at).toLocaleTimeString()
            }));
            setAccounts(mappedAccounts);
          } else {
            // Seed base sample monitors for user convenience
            setAccounts(INITIAL_ACCOUNTS);
          }

          // D. Load Alerts
          const { data: alertsData } = await supabase
            .from('alerts')
            .select('*')
            .eq('user_id', sessionUser.id)
            .order('created_at', { ascending: false });

          if (alertsData && alertsData.length > 0) {
            const mappedAlerts: Alert[] = alertsData.map(a => ({
              id: a.id,
              title: 'Alerta de Anúncio - Sistema',
              accountName: 'Monitor Ativo',
              platform: 'facebook',
              severity: (a.type || 'info') as any,
              timestamp: 'Sincronizado',
              status: (a.status || 'active') as any,
              message: a.message,
              technicalReason: 'Alerta persistido em Banco Corporativo.',
              recommendation: 'Acesse o painel do gerenciador para solucionar.'
            }));
            setAlerts(mappedAlerts);
          } else {
            setAlerts(INITIAL_ALERTS);
          }
        } catch (error) {
          console.error('Error syncing Supabase dashboard state:', error);
        } finally {
          setDbLoading(false);
        }
      };

      syncSupabaseState();
    }
  }, [isLoggedIn, sessionUser, isConfigured]);

  // Global Handlers
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false); // Close mobile drawer on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleSignUpSuccess = (email: string, agency: string, phone: string) => {
    setUserEmail(email);
    setUserAgency(agency);
    setUserPhone(phone);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    try {
      if (isConfigured) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setIsLoggedIn(false);
    setSessionUser(null);
    setCurrentPage('landing');
  };

  const handleAddAccount = async (name: string, platform: Platform, spend: number) => {
    const newId = 'acc_' + Date.now();
    const newAcc: AdAccount = {
      id: newId,
      name,
      platform,
      status: 'active',
      activeCampaigns: Math.floor(Math.random() * 8) + 1,
      spend24h: spend,
      unusualActivityCount: 0,
      lastSync: 'Sincronizado agora',
    };
    
    setAccounts([newAcc, ...accounts]);

    if (isConfigured && sessionUser) {
      try {
        await supabase.from('monitors').insert({
          user_id: sessionUser.id,
          name: name,
          target_url: 'https://exemplo.com/' + name.toLowerCase().replace(/[^a-z0-9]/g, ''),
          keyword: platform,
          frequency: 'hourly',
          email: userEmail,
          whatsapp_number: userPhone,
          is_active: true
        });
      } catch (err) {
        console.error('Failed to write monitor entry to Supabase:', err);
      }
    }
  };

  const handleToggleAccountStatus = async (id: string) => {
    const isUuid = id.length > 20;
    
    setAccounts(accounts.map(acc => {
      if (acc.id === id) {
        const newStatus = acc.status === 'paused' ? 'active' : 'paused';
        return {
          ...acc,
          status: newStatus,
          spend24h: newStatus === 'paused' ? 0 : acc.spend24h,
          activeCampaigns: newStatus === 'paused' ? 0 : acc.activeCampaigns,
          lastSync: 'Modificado agora'
        };
      }
      return acc;
    }));

    if (isConfigured && sessionUser && isUuid) {
      try {
        const target = accounts.find(a => a.id === id);
        if (target) {
          await supabase
            .from('monitors')
            .update({ is_active: target.status !== 'active' })
            .eq('id', id);
        }
      } catch (err) {
        console.error('Failed to update monitor in Supabase:', err);
      }
    }
  };

  const handleDeleteAccount = async (id: string) => {
    const isUuid = id.length > 20;

    if (isConfigured && sessionUser && isUuid) {
      try {
        const { error } = await supabase
          .from('monitors')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Failed to delete monitor from database:', error);
          throw new Error(error.message);
        }

        // Transação concluída com sucesso, atualiza o estado local
        setAccounts(prev => prev.filter(acc => acc.id !== id));
      } catch (err) {
        console.error('Failed to delete monitor:', err);
        throw err; // Propagar o erro para quem o chamou
      }
    } else {
      // Local/offline ou fallback do sandbox
      setAccounts(prev => prev.filter(acc => acc.id !== id));
    }
  };

  const handleResolveAlert = async (id: string) => {
    const isUuid = id.length > 20;

    setAlerts(alerts.map(alt => 
      alt.id === id 
        ? { ...alt, status: 'resolved' as const } 
        : alt
    ));

    if (isConfigured && sessionUser && isUuid) {
      try {
        await supabase
          .from('alerts')
          .update({ status: 'resolved' })
          .eq('id', id);
      } catch (err) {
        console.error('Failed to update alert in Supabase:', err);
      }
    }
  };

  const handleAddCustomAlert = async (alert: Alert) => {
    const localId = 'alt_' + Date.now();
    const newAlert = {
      ...alert,
      id: localId
    };

    setAlerts([newAlert, ...alerts]);
    
    // Set the related account status to error to reflect in monitoring cards!
    setAccounts(prevAccounts => prevAccounts.map(acc => {
      if (acc.name === alert.accountName) {
        return { ...acc, status: 'error' as const };
      }
      return acc;
    }));

    if (isConfigured && sessionUser) {
      try {
        await supabase.from('alerts').insert({
          user_id: sessionUser.id,
          type: alert.severity,
          message: `${alert.accountName} - ${alert.title}`,
          status: 'sent'
        });
      } catch (err) {
        console.error('Failed to persist custom alert to Supabase:', err);
      }
    }
  };

  const handleClearAlerts = () => {
    setAlerts(alerts.filter(alt => alt.status === 'active'));
  };

  const handleForceSync = () => {
    setAccounts(prev => prev.map(acc => {
      if (acc.status === 'active') {
        return {
          ...acc,
          spend24h: acc.spend24h * (1 + (Math.random() * 0.1 - 0.05)),
          lastSync: 'Recarregado agora'
        };
      }
      return acc;
    }));
  };

  const handleSaveConfig = async (formData: any) => {
    if (formData.phone) setUserPhone(formData.phone);

    if (isConfigured && sessionUser) {
      try {
        // Save to Notification Settings
        await supabase
          .from('notification_settings')
          .upsert({
            user_id: sessionUser.id,
            whatsapp_number: formData.phone || userPhone,
            whatsapp_enabled: formData.alertOnCritical || true,
            email_enabled: true
          });
      } catch (e) {
        console.error('Failed to save configuration settings to Supabase:', e);
      }
    }
  };

  const handleSaveDynamicCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl || !inputKey) return;
    saveTemporaryCredentials(inputUrl, inputKey);
    setShowConfigModal(false);
  };

  const handleClearDynamicCreds = () => {
    clearTemporaryCredentials();
  };

  // Decide what view component to present
  const isProtectedRoute = ['dashboard', 'monitoring', 'alerts', 'settings'].includes(currentPage);

  const activeView = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;
      case 'register':
        return <SignUpPage onNavigate={handleNavigate} onSignUpSuccess={handleSignUpSuccess} />;
      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} />;
      
      // Protected Operations Views
      case 'dashboard':
        return (
          <DashboardView 
            accounts={accounts} 
            alerts={alerts} 
            onNavigate={handleNavigate}
            onResolveAlert={handleResolveAlert}
          />
        );
      case 'monitoring':
        return (
          <MonitoringView 
            accounts={accounts} 
            onAddAccount={handleAddAccount}
            onToggleStatus={handleToggleAccountStatus}
            onDeleteAccount={handleDeleteAccount}
            onForceSync={handleForceSync}
          />
        );
      case 'alerts':
        return (
          <AlertsView 
            alerts={alerts} 
            onResolveAlert={handleResolveAlert}
            onAddCustomAlert={handleAddCustomAlert}
            onClearAlerts={handleClearAlerts}
          />
        );
      case 'settings':
        return <SettingsView onSaveConfig={handleSaveConfig} />;
      
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  // Calculate active alerts badge indicator
  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div id="application-root" className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
      
      {/* CASE A: IS IN PUBLIC MARKETING AREA (Landing, Login, Register, Pricing) */}
      {!isProtectedRoute ? (
        <div id="public-view-container">
          {activeView()}
        </div>
      ) : (
        /* CASE B: IS AUTHENTICATED WEB APP PANEL LAYOUT (Dashboard, Monitoring, Alerts, Settings) */
        <div id="private-panel-layout" className="flex h-screen overflow-hidden">
          
          {/* 1. SIDEBAR NAVIGATION - DESKTOP VIEW */}
          <aside id="sidebar-desktop" className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-[#E2E8F0]/10 shrink-0 h-full p-6 justify-between">
            <div className="space-y-8">
              {/* Logo block */}
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigate('landing')}>
                <div className="p-2 bg-[#2563EB] text-white rounded-xl shadow-md">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-tight text-white">
                  Alert<span className="text-[#2563EB]">Ads</span>
                </span>
              </div>

              {/* Navigation Actions list */}
              <nav id="sidebar-nav-desktop" className="space-y-1.5 text-xs font-semibold">
                
                {/* Board */}
                <button
                  id="tab-dashboard"
                  onClick={() => handleNavigate('dashboard')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-150 cursor-pointer ${
                    currentPage === 'dashboard' 
                      ? 'bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/25' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Painel Geral</span>
                </button>

                {/* Accounts and tracking */}
                <button
                  id="tab-monitoring"
                  onClick={() => handleNavigate('monitoring')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-150 cursor-pointer ${
                    currentPage === 'monitoring' 
                      ? 'bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/25' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>Monitoramentos</span>
                </button>

                {/* Instant Alertas (Real time state) */}
                <button
                  id="tab-alerts"
                  onClick={() => handleNavigate('alerts')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition duration-150 cursor-pointer ${
                    currentPage === 'alerts' 
                      ? 'bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/25' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Alertas e IA</span>
                  </div>
                  {activeAlertsCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-600 text-white rounded-full text-[9px] font-bold">
                      {activeAlertsCount}
                    </span>
                  )}
                </button>

                {/* Configurations */}
                <button
                  id="tab-settings"
                  onClick={() => handleNavigate('settings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-150 cursor-pointer ${
                    currentPage === 'settings' 
                      ? 'bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/25' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-4 h-4 shrink-0" />
                  <span>Configurações</span>
                </button>
              </nav>
            </div>

            {/* Down User panel status details */}
            <div className="pt-6 border-t border-[#E2E8F0]/10 flex flex-col space-y-4">
              <div className="flex items-start space-x-2.5 text-xs">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-[#38BDF8] border border-[#38BDF8]/20 flex items-center justify-center font-bold">
                  {userAgency.slice(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h5 className="font-bold text-white text-[11px] truncate whitespace-nowrap">{userAgency}</h5>
                  <p className="text-[9px] text-[#64748B] truncate block">{userEmail}</p>
                </div>
              </div>

              {/* Sair session trigger */}
              <button 
                id="do-logout-btn"
                onClick={handleLogout}
                className="w-full flex items-center space-x-2.5 px-4 py-2.5 bg-slate-800/50 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 hover:border-rose-900/40 border border-[#E2E8F0]/5 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair do Painel</span>
              </button>
            </div>
          </aside>

          {/* 2. MOBILE HEADER & TO-BAR WITH DRAWER DRAWER TOGGLER */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* Header top strip */}
            <header className="bg-white border-b border-[#E2E8F0] px-4 py-3 shrink-0 flex items-center justify-between z-10">
              
              {/* Mobile Sidebar Hamburger Trigger */}
              <div className="flex items-center space-x-3 lg:hidden">
                <button 
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-800 transition"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-sm">AlertAds</span>
                  <span className="text-[10px] bg-blue-100 text-[#2563EB] px-1.5 py-0.5 rounded font-extrabold">SAAS</span>
                </div>
              </div>

              {/* Status details indicators (Desktop tobar) */}
              <div className="hidden lg:flex items-center space-x-4 text-xs font-semibold text-slate-700">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">Assinatura:</span>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-bold text-[11px]">Agência Premium Pro</span>
                
                <span className="text-slate-300">|</span>
                
                <span className="flex items-center text-slate-600">
                  <Smartphone className="w-4 h-4 text-emerald-600 mr-1.5" />
                  WhatsAtivo: <strong className="text-[#0F172A] ml-1">{userPhone}</strong>
                </span>

                <span className="text-slate-300">|</span>

                {/* Supabase connection indicator pill */}
                {isConfigured ? (
                  <span className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[10px] font-bold">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Nuvem Integrada</span>
                  </span>
                ) : (
                  <button 
                    onClick={() => {
                      setInputUrl(supabaseUrl || '');
                      setShowConfigModal(true);
                    }}
                    className="flex items-center space-x-1 px-2.5 py-0.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-full text-[10px] font-semibold transition cursor-pointer"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Conectar Banco de Dados</span>
                  </button>
                )}
              </div>

              {/* Actions/Bell profile header keys */}
              <div className="flex items-center space-x-3 text-xs">
                {isConfigured && (
                  <button 
                    onClick={handleClearDynamicCreds}
                    className="px-2.5 py-1 text-[10px] text-rose-600 font-semibold border border-rose-100 bg-rose-50 hover:bg-rose-100 rounded-lg mr-2 transition cursor-pointer"
                    title="Limpa chaves customizadas salvas localmente"
                  >
                    Limpar Conexão
                  </button>
                )}
                
                <button 
                  onClick={() => handleNavigate('alerts')}
                  className="p-2 bg-slate-50 border border-[#E2E8F0] hover:bg-slate-100 rounded-xl relative text-slate-800 transition"
                  title="Alertas Pendentes"
                >
                  <Bell className="w-4 h-4" />
                  {activeAlertsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-600 text-white border-2 border-white rounded-full flex items-center justify-center text-[9px] font-bold">
                      {activeAlertsCount}
                    </span>
                  )}
                </button>
              </div>
            </header>

            {/* Offline/Not integrated banner when not configured */}
            {!isConfigured && (
              <div className="bg-amber-50/90 border-b border-amber-100 py-2.5 px-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-amber-900 font-sans shadow-sm">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Servidor em Nuvem offline:</strong> Os dados estão rodando em modo simulação offline. Você pode integrar suas chaves de acesso à API instantaneamente.
                  </span>
                </div>
                <button 
                  onClick={() => setShowConfigModal(true)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded-lg shadow transition cursor-pointer shrink-0"
                >
                  Conectar Chaves
                </button>
              </div>
            )}

            {/* Supabase Live Credentials Config Modlet */}
            {showConfigModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md space-y-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-[#2563EB]/10 rounded-lg text-[#2563EB]">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0F172A] text-sm">Conectar Painel ao Servidor</h3>
                      <p className="text-[10px] text-[#64748B]">Suas chaves serão salvas localmente no localStorage com segurança.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveDynamicCreds} className="space-y-3.5 text-xs text-slate-700">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">ENDEREÇO DO SERVIDOR</label>
                      <input 
                        required
                        type="url" 
                        value={inputUrl}
                        onChange={e => setInputUrl(e.target.value)}
                        placeholder="https://your-project.supabase.co"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">CHAVE DE ACESSO ATIVA</label>
                      <input 
                        required
                        type="password" 
                        value={inputKey}
                        onChange={e => setInputKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end space-x-2">
                       <button 
                        type="button"
                        onClick={() => setShowConfigModal(false)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Voltar
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                      >
                        Salvar e Conectar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 3. CORE ADM BODY CONTENT CONTAINER (Scrollable canvas) */}
            <main id="adm-main-scrollable" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
              {dbLoading && (
                <div className="mb-4 p-2.5 bg-blue-50 border border-blue-100 text-blue-800 text-xs rounded-xl flex items-center space-x-2 animate-pulse">
                  <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                  <span>Sincronizando tabelas com o banco carregado...</span>
                </div>
              )}
              <div className="max-w-7xl mx-auto">
                {activeView()}
              </div>
            </main>
          </div>

          {/* 4. DYNAMIC SLIDE-OUT DRAWER FOR SMARTPHONE MOBILE LAYOUT */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              {/* Dark Backdrop filter overlay */}
              <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Drawer Container */}
              <div className="relative flex flex-col w-4/5 max-w-sm bg-slate-900 text-slate-300 p-6 justify-between h-full animate-slide-in">
                
                {/* Close trigger button inside drawer */}
                <div className="absolute top-4 right-4 text-slate-400">
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Logo header inside drawer */}
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigate('landing')}>
                    <div className="p-2 bg-[#2563EB] text-white rounded-xl">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-white">AlertAds</span>
                  </div>

                  {/* Nav actions links drawer list */}
                  <nav className="space-y-1.5 text-xs font-semibold">
                    <button
                      onClick={() => handleNavigate('dashboard')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                        currentPage === 'dashboard' ? 'bg-[#2563EB]/20 text-white' : 'hover:bg-slate-800'
                      }`}
                    >
                      <LayoutDashboard className="w-4.5 h-4.5 shrink-0" />
                      <span>Painel Geral</span>
                    </button>

                    <button
                      onClick={() => handleNavigate('monitoring')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                        currentPage === 'monitoring' ? 'bg-[#2563EB]/20 text-white' : 'hover:bg-slate-800'
                      }`}
                    >
                      <Activity className="w-4.5 h-4.5 shrink-0" />
                      <span>Monitoramentos</span>
                    </button>

                    <button
                      onClick={() => handleNavigate('alerts')}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                        currentPage === 'alerts' ? 'bg-[#2563EB]/20 text-white' : 'hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                        <span>Alertas e IA</span>
                      </div>
                      {activeAlertsCount > 0 && (
                        <span className="px-2 py-0.5 bg-red-600 text-white rounded-full text-[9px] font-bold">
                          {activeAlertsCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleNavigate('settings')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                        currentPage === 'settings' ? 'bg-[#2563EB]/20 text-white' : 'hover:bg-slate-800'
                      }`}
                    >
                      <Sliders className="w-4.5 h-4.5 shrink-0" />
                      <span>Configurações</span>
                    </button>
                  </nav>
                </div>

                {/* Profile panel bottom mobile */}
                <div className="pt-6 border-t border-[#E2E8F0]/10 flex flex-col space-y-4">
                  <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-[#38BDF8]/20 flex items-center justify-center font-bold text-white">
                      {userAgency.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-[11px] truncate">{userAgency}</h5>
                      <span className="text-[10px] text-slate-500 block truncate">{userPhone}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2.5 py-3 bg-slate-800 text-rose-400 hover:bg-rose-950/20 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da Conta</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
