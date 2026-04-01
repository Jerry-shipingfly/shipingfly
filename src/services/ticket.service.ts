/**
 * Ticket Service
 * @description Handle ticket list, details, creation, reply and other ticket-related functions
 */

import { api } from './api';
import { Ticket, TicketDetail, TicketQueryParams, CreateTicketRequest, ReplyTicketRequest, PaginatedResponse, TicketMessage, TicketStatus } from '@/types/ticket.types';
import { MOCK_TICKETS, MOCK_TICKET_DETAILS, simulateDelay } from '@/mocks/ticket.mock';

export const ticketService = {
  /**
   * Get ticket list
   */
  async getTickets(params?: TicketQueryParams): Promise<PaginatedResponse<Ticket>> {
    // TODO: Connect to real API
    // const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    // return api.get(`/tickets${queryString}`);

    // Mock implementation
    await simulateDelay(600);

    let filteredTickets = [...MOCK_TICKETS];

    // Search filter
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.ticketNumber.toLowerCase().includes(searchLower) ||
        ticket.subject.toLowerCase().includes(searchLower) ||
        ticket.customerName.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (params?.status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === params.status);
    }

    // Type filter
    if (params?.type) {
      filteredTickets = filteredTickets.filter(ticket => ticket.type === params.type);
    }

    // Priority filter
    if (params?.priority) {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === params.priority);
    }

    // Sort
    if (params?.sortBy) {
      filteredTickets.sort((a, b) => {
        const aVal = a[params.sortBy!];
        const bVal = b[params.sortBy!];
        if (params.sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

    return {
      data: paginatedTickets,
      total: filteredTickets.length,
      page,
      limit,
      totalPages: Math.ceil(filteredTickets.length / limit),
    };
  },

  /**
   * Get ticket detail
   */
  async getTicketDetail(id: string): Promise<TicketDetail> {
    // TODO: Connect to real API
    // return api.get(`/tickets/${id}`);

    // Mock implementation
    await simulateDelay(500);
    const ticket = MOCK_TICKET_DETAILS.find(t => t.id === id) || MOCK_TICKETS.find(t => t.id === id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return ticket as TicketDetail;
  },

  /**
   * Create ticket
   */
  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    // TODO: Connect to real API
    // return api.post('/tickets', data);

    // Mock implementation
    await simulateDelay(800);

    const newTicket: Ticket = {
      id: String(MOCK_TICKETS.length + 1),
      ticketNumber: `TKT${Date.now()}`,
      type: data.type,
      subject: data.subject,
      description: data.description,
      status: 'open',
      priority: data.priority || 'medium',
      customerName: 'Current User',
      customerEmail: 'user@example.com',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newTicket;
  },

  /**
   * Reply to ticket
   */
  async replyTicket(id: string, data: ReplyTicketRequest): Promise<TicketMessage> {
    // TODO: Connect to real API
    // return api.post(`/tickets/${id}/reply`, data);

    // Mock implementation
    await simulateDelay(400);

    const newMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticketId: id,
      content: data.content,
      sender: 'customer',
      senderName: 'Current User',
      attachments: data.attachments?.map(f => f.name) || [],
      createdAt: new Date().toISOString(),
    };

    return newMessage;
  },

  /**
   * Close ticket
   */
  async closeTicket(id: string): Promise<{ message: string }> {
    // TODO: Connect to real API
    // return api.post(`/tickets/${id}/close`);

    // Mock implementation
    await simulateDelay(400);
    return { message: 'Ticket closed successfully' };
  },

  /**
   * Update ticket status
   */
  async updateTicketStatus(id: string, status: TicketStatus): Promise<Ticket> {
    // TODO: Connect to real API
    // return api.patch(`/tickets/${id}/status`, { status });

    // Mock implementation
    await simulateDelay(400);

    const ticket = MOCK_TICKETS.find(t => t.id === id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return {
      ...ticket,
      status,
      updatedAt: new Date().toISOString(),
    };
  },
};
