import React from 'react';

export interface TooltipProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
  title?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<any>) => void;
  [key: string]: any;
}

/**
 * RelateIQ Enterprise Design System - Tooltip Component
 * Provides accessible, themed, responsive UI element for modern CRM workflows.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  id,
  className = '',
  children,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-transparent';
      case 'secondary':
        return 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border-transparent';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white border-transparent';
      case 'outline':
        return 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800';
      case 'ghost':
        return 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800 border-transparent';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2.5 py-1.5 text-xs rounded-md';
      case 'lg':
        return 'px-5 py-3 text-base rounded-xl';
      case 'md':
      default:
        return 'px-4 py-2 text-sm rounded-lg';
    }
  };

  return (
    <div
      id={id}
      title={title}
      onClick={disabled ? undefined : onClick}
      className={`relateiq-tooltip transition-all duration-200 font-medium ${getVariantStyles()} ${getSizeStyles()} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      {title && <span className="component-title block text-xs font-semibold mb-1">{title}</span>}
      {children}
    </div>
  );
};

export default Tooltip;
