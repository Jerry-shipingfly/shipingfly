/**
 * Create Ticket Modal Component
 * @description Modal form for creating new support tickets
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ticketService } from '@/services/ticket.service';
import { TicketType, TicketPriority, CreateTicketRequest } from '@/types/ticket.types';
import { useTranslation } from '@/hooks/useTranslation';
import toast from 'react-hot-toast';

/**
 * CreateTicketModal Props
 */
interface CreateTicketModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback after successful ticket creation */
  onSuccess?: () => void;
}

/**
 * CreateTicketModal Component
 */
export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateTicketRequest>({
    type: 'technical',
    subject: '',
    description: '',
    priority: 'medium',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTicketRequest, string>>>({});

  // Ticket type options
  const typeOptions = [
    { value: 'technical', label: t('support.typeTechnical') },
    { value: 'billing', label: t('support.typeBilling') },
    { value: 'shipping', label: t('support.typeShipping') },
    { value: 'aftersales', label: t('support.typeAftersales') },
    { value: 'complaint', label: t('support.typeComplaint') },
    { value: 'suggestion', label: t('support.typeSuggestion') },
    { value: 'product', label: t('support.typeProduct') },
    { value: 'account', label: t('support.typeAccount') },
    { value: 'other', label: t('support.typeOther') },
  ];

  // Priority options
  const priorityOptions = [
    { value: 'low', label: t('support.priorityLow') },
    { value: 'medium', label: t('support.priorityMedium') },
    { value: 'high', label: t('support.priorityHigh') },
    { value: 'urgent', label: t('support.priorityUrgent') },
  ];

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      type: 'technical',
      subject: '',
      description: '',
      priority: 'medium',
    });
    setErrors({});
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTicketRequest, string>> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = t('validation.required');
    } else if (formData.subject.length < 5) {
      newErrors.subject = t('validation.minLength', { min: 5 });
    }

    if (!formData.description.trim()) {
      newErrors.description = t('validation.required');
    } else if (formData.description.length < 10) {
      newErrors.description = t('validation.minLength', { min: 10 });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await ticketService.createTicket(formData);
      toast.success(t('support.ticketCreated'));
      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error(t('messages.operationFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update form field
  const updateField = <K extends keyof CreateTicketRequest>(
    field: K,
    value: CreateTicketRequest[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('support.newTicket')}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Ticket Type */}
        <Select
          label={t('support.type')}
          options={typeOptions}
          value={formData.type}
          onChange={(value) => updateField('type', value as TicketType)}
        />

        {/* Priority */}
        <Select
          label={t('support.priority')}
          options={priorityOptions}
          value={formData.priority}
          onChange={(value) => updateField('priority', value as TicketPriority)}
        />

        {/* Subject */}
        <Input
          label={t('support.subject')}
          placeholder={t('support.subject')}
          value={formData.subject}
          onChange={(e) => updateField('subject', e.target.value)}
          error={errors.subject}
        />

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('common.description')}
          </label>
          <textarea
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 resize-none"
            rows={5}
            placeholder={t('common.description')}
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
          {errors.description && (
            <p className="text-sm text-red-500" role="alert">
              {errors.description}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateTicketModal;
