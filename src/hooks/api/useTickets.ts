/**
 * Ticket Hook
 * @description Uses SWR to wrap ticket data fetching
 */

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { ticketService } from '@/services/ticket.service';
import { Ticket, TicketDetail, TicketQueryParams, CreateTicketRequest, ReplyTicketRequest, PaginatedResponse } from '@/types/ticket.types';

/**
 * Get ticket list hook
 * @param params - Query parameters (search, filter, pagination)
 * @returns Ticket list data and status
 */
export function useTickets(params?: TicketQueryParams) {
  const { data, isLoading, error, mutate } = useSWR<PaginatedResponse<Ticket>>(
    ['tickets', params],
    () => ticketService.getTickets(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    tickets: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 0,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}

/**
 * Get ticket detail hook
 * @param id - Ticket ID
 * @returns Ticket detail data and status
 */
export function useTicketDetail(id?: string) {
  const { data, isLoading, error, mutate } = useSWR<TicketDetail>(
    id ? ['ticket-detail', id] : null,
    () => ticketService.getTicketDetail(id!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    ticket: data,
    isLoading,
    isError: !!error,
    error: error?.message,
    mutate,
  };
}

/**
 * Create ticket hook
 */
export function useCreateTicket() {
  const { trigger, isMutating, error } = useSWRMutation(
    'create-ticket',
    async (_key: string, { arg }: { arg: CreateTicketRequest }) => {
      return ticketService.createTicket(arg);
    }
  );

  return {
    createTicket: trigger,
    isCreating: isMutating,
    error: error?.message,
  };
}

/**
 * Reply to ticket hook
 */
export function useReplyTicket() {
  const { trigger, isMutating, error } = useSWRMutation(
    'reply-ticket',
    async (_key: string, { arg }: { arg: { ticketId: string; data: ReplyTicketRequest } }) => {
      return ticketService.replyTicket(arg.ticketId, arg.data);
    }
  );

  return {
    replyTicket: trigger,
    isReplying: isMutating,
    error: error?.message,
  };
}

export default useTickets;
