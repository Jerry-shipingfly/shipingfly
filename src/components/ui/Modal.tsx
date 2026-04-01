import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/helpers';

/**
 * Modal component size types
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Modal component Props interface
 */
export interface ModalProps {
  /** Whether visible */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Title */
  title?: string;
  /** Size */
  size?: ModalSize;
  /** Children */
  children: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Extended class name */
  className?: string;
  /** Whether to show close button */
  showClose?: boolean;
  /** Whether clicking overlay closes modal */
  closeOnOverlay?: boolean;
  /** Whether to lock body scroll */
  lockScroll?: boolean;
}

/**
 * Size style mapping
 */
const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm max-h-[80vh]',
  md: 'max-w-md max-h-[80vh]',
  lg: 'max-w-lg max-h-[85vh]',
  xl: 'max-w-xl max-h-[90vh]',
  full: 'max-w-[90vw] max-h-[90vh]',
};

/**
 * Common modal dialog component
 * @description Supports multiple sizes, ESC close, overlay click close, etc.
 *
 * @example
 * // Basic usage
 * <Modal isOpen={isOpen} onClose={handleClose} title="Confirm Delete">
 *   <p>Are you sure you want to delete this item?</p>
 *   <template #footer>
 *     <Button variant="ghost" onClick={handleClose}>Cancel</Button>
 *     <Button variant="danger" onClick={handleConfirm}>Confirm</Button>
 *   </template>
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  className,
  showClose = true,
  closeOnOverlay = true,
  lockScroll = true,
}) => {
  // Close on ESC key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Close on overlay click
  const handleOverlayClick = () => {
    if (closeOnOverlay) {
      onClose();
    }
  };

  // Manage scroll lock and keyboard events
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      if (lockScroll) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (lockScroll) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, handleEscape, lockScroll]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={cn(
          // 布局
          'relative flex flex-col',
          // 盒模型
          'w-full mx-4 rounded-lg',
          // 背景 & 阴影
          'bg-white shadow-xl',
          // 动画
          'animate-in fade-in-0 zoom-in-95',
          // 尺寸
          sizeStyles[size],
          // 用户自定义样式
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500'
                )}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          {children}
        </div>

        {/* Footer button area */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
