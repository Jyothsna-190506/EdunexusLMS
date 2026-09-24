import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderColor = 'var(--primary)';
        let iconColor = 'var(--primary)';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderColor = 'var(--success)';
          iconColor = 'var(--success)';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = 'var(--warning)';
          iconColor = 'var(--warning)';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderColor = 'var(--danger)';
          iconColor = 'var(--danger)';
        }

        return (
          <div
            key={toast.id}
            className="toast"
            style={{ borderLeft: `4px solid ${borderColor}` }}
          >
            <Icon size={20} color={iconColor} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '2px',
                display: 'flex',
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
