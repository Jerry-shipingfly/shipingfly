import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/utils/helpers';

/**
 * Toast type
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast数据结构
 */
export interface ToastData {
  /** 唯一ID */
  id: string;
  /** 类型 */
  type: ToastType;
  /** 标题 */
  title?: string;
  /** 内容 */
  message: string;
  /** 持续时间（毫秒），0表示不自动关闭 */
  duration?: number;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
}

/**
 * Toast组件的Props接口
 */
export interface ToastProps extends Omit<ToastData, 'id'> {
  /** 扩展样式类名 */
  className?: string;
}

/**
 * ToastContext
 */
interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * 类型配置映射
 */
const typeConfig: Record<ToastType, { icon: React.ReactNode; className: string }> = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    className: 'bg-green-50 border-green-200 text-green-800',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    className: 'bg-red-50 border-red-200 text-red-800',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    className: 'bg-blue-50 border-blue-200 text-blue-800',
  },
};

/**
 * 图标颜色映射
 */
const iconColorStyles: Record<ToastType, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

let toastIdCounter = 0;

/**
 * Toast Provider组件
 * @description 提供Toast上下文，用于全局管理Toast
 *
 * @example
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>): string => {
    const id = `toast-${++toastIdCounter}`;
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration ?? 3000,
      closable: toast.closable ?? true,
    };

    setToasts((prev) => [...prev, newToast]);

    // 自动关闭
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      toast?.onClose?.();
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, removeAllToasts }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

/**
 * Toast容器组件
 */
const ToastContainer: React.FC<{
  toasts: ToastData[];
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed z-[9999] flex flex-col gap-2"
      style={{ top: 16, right: 16 }}
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

/**
 * Toast项组件
 */
const ToastItem: React.FC<ToastData & { onClose: () => void }> = ({
  type,
  title,
  message,
  closable,
  onClose,
}) => {
  const config = typeConfig[type];

  return (
    <div
      className={cn(
        // 布局
        'flex items-start gap-3',
        // 盒模型
        'w-80 p-4 rounded-lg border',
        // 阴影
        'shadow-lg',
        // 动画
        'animate-in slide-in-from-right-full',
        // 类型样式
        config.className
      )}
      role="alert"
    >
      {/* 图标 */}
      <div className={cn('flex-shrink-0', iconColorStyles[type])}>
        {config.icon}
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        {title && (
          <div className="font-medium mb-1">{title}</div>
        )}
        <div className="text-sm opacity-90">{message}</div>
      </div>

      {/* 关闭按钮 */}
      {closable && (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'flex-shrink-0 p-1 rounded',
            'hover:bg-black/5',
            'transition-colors'
          )}
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

/**
 * 单个Toast组件
 * @description 独立使用的Toast组件
 */
const ToastComponent: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 3000,
  closable = true,
  className,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);
  const config = typeConfig[type];

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        'w-80 p-4 rounded-lg border shadow-lg',
        'animate-in slide-in-from-right-full',
        config.className,
        className
      )}
      role="alert"
    >
      <div className={cn('flex-shrink-0', iconColorStyles[type])}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        {title && <div className="font-medium mb-1">{title}</div>}
        <div className="text-sm opacity-90">{message}</div>
      </div>
      {closable && (
        <button
          type="button"
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// 使用类型断言添加静态属性
export const Toast = Object.assign(ToastComponent, {
  Provider: ToastProvider,
  useToast,
}) as React.FC<ToastProps> & {
  Provider: typeof ToastProvider;
  useToast: typeof useToast;
};

/**
 * useToast Hook
 * @description 用于在组件中显示Toast
 *
 * @example
 * const { showSuccess, showError } = useToast();
 * showSuccess('操作成功');
 * showError('操作失败');
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, removeAllToasts } = context;

  const show = useCallback(
    (options: Omit<ToastData, 'id'>) => addToast(options),
    [addToast]
  );

  const showSuccess = useCallback(
    (message: string, title?: string) =>
      addToast({ type: 'success', message, title }),
    [addToast]
  );

  const showError = useCallback(
    (message: string, title?: string) =>
      addToast({ type: 'error', message, title }),
    [addToast]
  );

  const showWarning = useCallback(
    (message: string, title?: string) =>
      addToast({ type: 'warning', message, title }),
    [addToast]
  );

  const showInfo = useCallback(
    (message: string, title?: string) =>
      addToast({ type: 'info', message, title }),
    [addToast]
  );

  return {
    show,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    removeAllToasts,
  };
}

export default Toast;
