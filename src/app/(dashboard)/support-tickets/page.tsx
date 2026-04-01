/**
 * Support Tickets Page
 * @description Manage customer support tickets and inquiries
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useTickets } from '@/hooks/api/useTickets';
import { TicketTable } from './components/TicketTable';
import { CreateTicketModal } from './components/CreateTicketModal';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Empty } from '@/components/ui/Empty';
import { Ticket } from '@/types/ticket.types';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Support Tickets Page
 */
export default function SupportTicketsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 10;

  const { tickets, total, isLoading, isError, mutate } = useTickets({
    page,
    limit: pageSize,
  });

  // Calculate total pages
  const totalPages = Math.ceil(total / pageSize);

  // Handle view ticket detail
  const handleViewDetail = (ticket: Ticket) => {
    router.push(`/support-tickets/${ticket.id}`);
  };

  // Handle pagination change
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
  };

  // Handle open modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle ticket created
  const handleTicketCreated = () => {
    mutate(); // Refresh ticket list
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title={t('support.title')}
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenModal}>
            {t('support.newTicket')}
          </Button>
        }
      />

      {/* Tickets table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loading tip={t('common.loading')} />
        </div>
      ) : isError ? (
        <Empty
          preset="error"
          description={t('support.loadError')}
          action={
            <Button onClick={() => mutate()}>{t('common.retry')}</Button>
          }
        />
      ) : tickets.length === 0 ? (
        <Empty
          preset="folder"
          description={t('support.noTickets')}
          action={
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenModal}>
              {t('support.createTicket')}
            </Button>
          }
        />
      ) : (
        <TicketTable
          tickets={tickets}
          isLoading={isLoading}
          onViewDetail={handleViewDetail}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: handlePageChange,
          }}
        />
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleTicketCreated}
      />
    </div>
  );
}
