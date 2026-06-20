import React from 'react';
import { AlertType } from '../../types/monitoring';
import { getAlertTypeEmoji, getAlertTypeLabel } from '../../lib/notifications/notification-templates';

interface AlertEmailProps {
  monitorName: string;
  alertType: AlertType;
  message: string;
  dateTime: string;
  dashboardUrl: string;
}

export default function AlertEmail({
  monitorName,
  alertType,
  message,
  dateTime,
  dashboardUrl
}: AlertEmailProps) {
  const emoji = getAlertTypeEmoji(alertType);
  const label = getAlertTypeLabel(alertType);

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: '#F8FAFC',
      color: '#1E293B',
      margin: 0,
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          backgroundColor: '#0F172A',
          padding: '32px',
          textAlign: 'center',
          color: '#FFFFFF'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>AlertAds Vigilante</h1>
        </div>
        
        <div style={{ padding: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#F1F5F9',
            border: '1px solid #E2E8F0',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#475569',
            marginBottom: '24px'
          }}>
            <span>{emoji} {label}</span>
          </div>
          
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #F1F5F9',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>Monitoramento:</span>
              <strong style={{ color: '#0F172A' }}>{monitorName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>Detectado em:</span>
              <strong style={{ color: '#0F172A' }}>{dateTime}</strong>
            </div>
          </div>

          <div style={{
            backgroundColor: '#FEF2F2',
            borderLeft: '4px solid #EF4444',
            borderRadius: '4px',
            padding: '16px',
            marginBottom: '28px'
          }}>
            <strong style={{ display: 'block', fontSize: '13px', color: '#991B1B', marginBottom: '4px' }}>Motivo Técnico:</strong>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#991B1B', fontWeight: 500 }}>
              {message}
            </p>
          </div>

          <a 
            href={dashboardUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{
              display: 'block',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
              color: '#FFFFFF',
              padding: '14px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '14px',
              marginBottom: '24px'
            }}
          >
            Acessar Painel Direct
          </a>
        </div>
        
        <div style={{
          padding: '24px 32px',
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          textAlign: 'center',
          fontSize: '12px',
          color: '#64748B'
        }}>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            Este é um alerta automático gerado pelo micro-SaaS AlertAds.<br/>
            Configure suas notificações a qualquer momento no painel de configurações.
          </p>
        </div>
      </div>
    </div>
  );
}
