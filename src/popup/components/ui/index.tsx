import { useState, useEffect, useCallback } from 'react';
import { ToastMessage } from '@/popup/types';

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`neo-card rounded-[24px] p-4 transition-transform duration-200 hover:-translate-y-px ${className}`}>
    {children}
  </div>
);

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 text-[11px] font-semibold text-[#7d7468]">
    {children}
  </div>
);

export const Badge = ({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'active' | 'warning' }) => {
  const tones = {
    neutral: 'bg-[#e3dacb] text-[#7d7468]',
    active: 'bg-[#dfeede] text-[#4e7f59]',
    warning: 'bg-[#fff0bd] text-[#9b7315]',
  };

  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
};

export const TabButton = ({
  label,
  icon,
  isActive,
  onClick
}: {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    role="tab"
    aria-selected={isActive}
    className={`
      flex min-h-[42px] items-center justify-center gap-2 rounded-[18px] px-3 py-2 text-[12px] font-semibold outline-none transition-all duration-200
      focus-visible:ring-2 focus-visible:ring-[#ffc400]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f0e7]
      ${isActive
        ? "neo-pressed text-[#30343b]"
        : "neo-button text-[#7d7468] hover:text-[#30343b]"
      }
    `}
    onClick={onClick}
    title={label}
  >
    <span className="text-sm" aria-hidden="true">{icon}</span>
    <span>{label}</span>
  </button>
);

export const Button = ({
  children,
  onClick,
  variant = 'default',
  size = 'sm',
  className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'success';
  size?: 'sm' | 'xs';
  className?: string;
}) => {
  const variants = {
    default: 'text-[#30343b]',
    danger: 'text-[#a54e42]',
    success: 'text-[#4e7f59]',
  };
  const sizes = {
    sm: 'px-4 py-2 text-[12px]',
    xs: 'px-3 py-2 text-[11px]',
  };

  return (
    <button
      type="button"
      className={`neo-button rounded-[16px] font-semibold transition-all duration-200 outline-none active:translate-y-0 focus-visible:ring-2 focus-visible:ring-[#ffc400]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f0e7] ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const Toast = ({ messages, onDismiss }: { messages: ToastMessage[]; onDismiss: (id: number) => void }) => {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex w-[320px] -translate-x-1/2 flex-col gap-2 pointer-events-none">
      {messages.map((msg) => (
        <ToastItem key={msg.id} message={msg} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem = ({ message, onDismiss }: { message: ToastMessage; onDismiss: (id: number) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(message.id), 3000);
    return () => clearTimeout(timer);
  }, [message.id, onDismiss]);

  const colors = {
    success: 'text-[#4e7f59]',
    info: 'text-[#30343b]',
    error: 'text-[#a54e42]',
  };

  return (
    <div
      className={`neo-card rounded-[18px] px-4 py-3 text-xs font-medium pointer-events-auto animate-fade-in cursor-pointer ${colors[message.type]}`}
      onClick={() => onDismiss(message.id)}
    >
      {message.text}
    </div>
  );
};

export const useToast = () => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, text, type }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { messages, addToast, dismissToast };
};
