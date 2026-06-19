import React, { useState } from 'react';
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
  DollarSign
} from 'lucide-react';
import { Page, AdAccount, Alert, Platform } from './types';
import { INITIAL_ACCOUNTS, INITIAL_ALERTS } from './services/mockData';

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
  
  // Mobile Sidebar Drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Corporate Profile States (customized during login/signup)
  const [userEmail, setUserEmail] = useState('demo@agenciapremium.com.br');
  const [userAgency, setUserAgency] = useState('Premium Performance Corp');
  const [userPhone, setUserPhone] = useState('5511999998888');

  // Shared Data States in Reactive UI
  const [accounts, setAccounts] = useState<AdAccount[]>(INITIAL_ACCOUNTS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);

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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };

  const handleAddAccount = (name: string, platform: Platform, spend: number) => {
    const newAcc: AdAccount = {
      id: 'acc_' + Date.now(),
      name,
      platform,
      status: 'active',
      activeCampaigns: Math.floor(Math.random() * 8) + 1,
      spend24h: spend,
      unusualActivityCount: 0,
      lastSync: 'Sincronizado agora',
    };
    setAccounts([newAcc, ...accounts]);
  };

  const handleToggleAccountStatus = (id: string) => {
    setAccounts(accounts.map(acc => {
      if (acc.id === id) {
        const newStatus = acc.status === 'paused' ? 'active' : 'paused';
        return {
          ...acc,
          status: newStatus,
          spend24h: newStatus === 'paused' ? 0 : acc.spend24h,
          activeCampaigns: newStatus === 'paused' ? 0 : acc.activeCampaigns,
          lastSync: 'Sincronizado agora'
        };
      }
      return acc;
    }));
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(alerts.map(alt => 
      alt.id === id 
        ? { ...alt, status: 'resolved' as const } 
        : alt
    ));
  };

  const handleAddCustomAlert = (alert: Alert) => {
    // Inject alert to head of table
    setAlerts([alert, ...alerts]);
    
    // Also change the related account status to error to reflect in monitoring cards!
    setAccounts(prevAccounts => prevAccounts.map(acc => {
      if (acc.name === alert.accountName) {
        return { ...acc, status: 'error' as const };
      }
      return acc;
    }));
  };

  const handleClearAlerts = () => {
    // Clear resolved alerts
    setAlerts(alerts.filter(alt => alt.status === 'active'));
  };

  const handleForceSync = () => {
    // Force simulation update
    setAccounts(prev => prev.map(acc => {
      if (acc.status === 'active') {
        // slight metrics fluctuation
        return {
          ...acc,
          spend24h: acc.spend24h * (1 + (Math.random() * 0.1 - 0.05)),
          lastSync: 'Refrescado agora'
        };
      }
      return acc;
    }));
  };

  const handleSaveConfig = (formData: any) => {
    if (formData.phone) setUserPhone(formData.phone);
  };

  // Decide what view component to present
  const isProtectedRoute = ['dashboard', 'monitoring', 'alerts', 'settings'].includes(currentPage);

  // If a user refreshes or requests an administrative screen directly, ensure they are logged in or log them in automatically for mock validation
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
                  <span className="text-[10px] bg-blue-100 text-[#2563EB] px-1.5 py-0.5 rounded font-extrabold">DEMO</span>
                </div>
              </div>

              {/* Status details indicators (Desktop tobar) */}
              <div className="hidden lg:flex items-center space-x-4 text-xs font-semibold text-slate-700">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">Assinatura:</span>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-bold">Agência Squad Pro</span>
                
                <span className="text-slate-300">|</span>
                
                <span className="flex items-center text-slate-600">
                  <Smartphone className="w-4 h-4 text-emerald-600 mr-1.5" />
                  WhatsAtivo: <strong className="text-[#0F172A] ml-1">{userPhone}</strong>
                </span>
              </div>

              {/* Actions/Bell profile header keys */}
              <div className="flex items-center space-x-3 text-xs">
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

            {/* 3. CORE ADM BODY CONTENT CONTAINER (Scrollable canvas) */}
            <main id="adm-main-scrollable" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
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
