/**
 * TicketTable Component
 * @description Ticket list table
 */

'use client';

import React from 'react';
import { Headphones, MessageSquare } from 'lucide-react';
import { Ticket, TicketStatus, TicketType } from '@/types/ticket.types';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

import { Table, TableColumn } from '@/components/ui/Table';

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
 * TicketTable Props
 */
interface TicketTableProps {
  /** Ticket list data */
  tickets: Ticket[];
  /** Loading state */
  isLoading?: boolean;
  /** View detail callback */
  onViewDetail?: (ticket: Ticket) => void;
  /** Pagination config */
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

/**
 * TicketTable Component
 */
export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  isLoading = false,
  onViewDetail,
  pagination,
}) => {
  const { t } = useTranslation();

  // Table column config
  const columns: TableColumn<Ticket>[] = [
    {
      title: t('support.ticketNo'),
      dataIndex: 'id',
      width: 100,
      render: (value) => (
        <span className="text-primary-600 font-mono">{value as string}</span>
      ),
    },
    {
      title: t('support.subject'),
      dataIndex: 'subject',
      width: 200,
      render: (value) => (
        <span className="text-gray-900">{value as string}</span>
      ),
    },
    {
      title: t('support.type'),
      dataIndex: 'type',
      width: 100,
      render: (value) => {
        const type = value as TicketType;
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
        return (
          <Badge variant="default" size="sm">
            {typeLabels[type] || type}
          </Badge>
        );
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 100,
      render: (value) => (
        <TicketStatusBadge status={value as TicketStatus} />
      ),
    },
    {
      title: t('common.createdAt'),
      dataIndex: 'createdAt',
      width: 150,
      render: (value) => (
        <span className="text-gray-500">{formatDate(value as string)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          dataSource={tickets}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          onRowClick={onViewDetail}
        />
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-end mt-4">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              disabled={pagination.current <= 1}
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
            >
              {t('common.previous')}
            </button>
            <span className="text-sm">
              {t('common.pageOf', { current: pagination.current, total: Math.ceil(pagination.total / pagination.pageSize) })}
            </span>
            <button
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
            >
              {t('common.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketTable;
