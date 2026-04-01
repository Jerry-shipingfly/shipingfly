/**
 * Ticket Detail Page
 * @description Display support ticket details including description and messages
 */

'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTicketDetail } from '@/hooks/api/useTickets';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { TicketStatus, TicketType, TicketPriority, TicketMessage } from '@/types/ticket.types';
import { formatDate } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/utils/helpers';

/**
 * Ticket Status Badge
 */
const TicketStatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
  const { t } = useTranslation();

  const statusConfig: Record<TicketStatus, { color: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
    open: { color: 'text-blue-600', variant: 'default' },
    in_progress: { color: 'text-yellow-600', variant: 'warning' },
    waiting_customer: { color: 'text-gray-600', variant: 'default' },
    resolved: { color: 'text-green-600', variant: 'success' },
    closed: { color: 'text-gray-400', variant: 'default' },
  };

  const config = statusConfig[status] || { color: 'text-gray-600', variant: 'default' };

  const statusLabels: Record<TicketStatus, string> = {
    open: t('support.statusOpen'),
    in_progress: t('support.statusInProgress'),
    waiting_customer: t('support.statusWaitingCustomer'),
    resolved: t('support.statusResolved'),
    closed: t('support.statusClosed'),
  };

  return (
    <Badge variant={config.variant} className={config.color}>
      {statusLabels[status] || status}
    </Badge>
  );
};

/**
 * Message Item Component
 */
const MessageItem: React.FC<{ message: TicketMessage; isLast: boolean }> = ({ message, isLast }) => {
  const isAgent = message.sender === 'agent';

  return (
    <div className={cn('flex gap-4', !isLast && 'pb-6 mb-6 border-b border-gray-100')}>
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0',
          isAgent ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
        )}
      >
        {message.senderName?.charAt(0).toUpperCase() || (isAgent ? 'A' : 'C')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-medium text-gray-900">
            {message.senderName || (isAgent ? 'Agent' : 'Customer')}
          </span>
          <Badge variant="default" size="sm">
            {isAgent ? 'Agent' : 'Customer'}
          </Badge>
          <span className="text-xs text-gray-400">{formatDate(message.createdAt, 'datetime')}</span>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

/**
 * Ticket Detail Page
 */
export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  const { ticket, isLoading, isError } = useTicketDetail(params.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <Loading size="lg" tip={t('common.loading')} />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{t('support.loadError')}</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">
          {t('common.back')}
        </Button>
      </div>
    );
  }

  const typeLabels: Record<TicketType, string> = {
    technical: t('support.typeTechnical'),
    billing: t('support.typeBilling'),
    shipping: t('support.typeShipping'),
    aftersales: t('support.typeAftersales'),
    complaint: t('support.typeComplaint'),
    suggestion: t('support.typeSuggestion'),
    product: t('support.typeProduct'),
    account: t('support.typeAccount'),
    other: t('support.typeOther'),
  };

  const priorityLabels: Record<TicketPriority, string> = {
    low: t('support.priorityLow'),
    medium: t('support.priorityMedium'),
    high: t('support.priorityHigh'),
    urgent: t('support.priorityUrgent'),
  };

  const priorityVariant: Record<TicketPriority, 'default' | 'success' | 'warning' | 'danger'> = {
    low: 'default',
    medium: 'default',
    high: 'warning',
    urgent: 'danger',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <PageHeader
        title={ticket.ticketNumber}
        breadcrumb={[
          { label: t('support.title'), href: '/support-tickets' },
          { label: ticket.ticketNumber },
        ]}
        backHref="/support-tickets"
      />

      {/* Main content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-6 lg:p-8 space-y-8">
          {/* Header info */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{ticket.subject}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                <span>{t('support.ticketNo')}: {ticket.id}</span>
                {ticket.orderNumber && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span>Order: {ticket.orderNumber}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TicketStatusBadge status={ticket.status} />
              <Badge variant="default" size="sm">{typeLabels[ticket.type] || ticket.type}</Badge>
              <Badge variant={priorityVariant[ticket.priority]} size="sm">
                {priorityLabels[ticket.priority] || ticket.priority}
              </Badge>
            </div>
          </div>

          {/* Meta info grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('common.createdAt')}</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(ticket.createdAt, 'datetime')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('common.updatedAt')}</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(ticket.updatedAt, 'datetime')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('tickets.customer')}</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{ticket.customerName}</p>
              <p className="text-sm text-gray-500">{ticket.customerEmail}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">{t('common.description')}</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          {/* Messages */}
          {ticket.messages && ticket.messages.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                {t('tickets.conversation')} ({ticket.messages.length})
              </h3>
              <div className="bg-white rounded-lg">
                {ticket.messages.map((message, index) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isLast={index === ticket.messages.length - 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
