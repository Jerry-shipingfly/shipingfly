/**
 * Ticket related type definitions
 */

import { ID, Timestamp, PaginatedResponse } from './common.types';

/**
 * Ticket status
 */
export type TicketStatus =
  | 'open'
  | 'in_progress'
  | 'waiting_customer'
  | 'resolved'
  | 'closed';

/**
 * Ticket type
 */
export type TicketType =
  | 'aftersales'
  | 'complaint'
  | 'suggestion'
  | 'technical'
  | 'billing'
  | 'shipping'
  | 'product'
  | 'account'
  | 'other';

/**
 * Ticket priority
 */
export type TicketPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

/**
 * Ticket message
 */
export interface TicketMessage {
  id: ID;
  ticketId: ID;
  content: string;
  sender: 'customer' | 'agent';
  senderName?: string;
  attachments?: string[];
  createdAt: Timestamp;
}

/**
 * Ticket basic information
 */
export interface Ticket {
  id: ID;
  ticketNumber: string;
  type: TicketType;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  orderId?: ID;
  orderNumber?: string;
  customerId?: ID;
  customerName: string;
  customerEmail: string;
  assigneeId?: ID;
  assigneeName?: string;
  messages: TicketMessage[];
  attachments?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  resolvedAt?: Timestamp;
  closedAt?: Timestamp;
}

/**
 * Ticket detail (extended information)
 */
export interface TicketDetail extends Ticket {
  customer?: {
    id: ID;
    name: string;
    email: string;
    phone?: string;
  };
}

/**
 * Ticket query parameters
 */
export interface TicketQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TicketStatus;
  type?: TicketType;
  priority?: TicketPriority;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Create ticket request
 */
export interface CreateTicketRequest {
  type: TicketType;
  subject: string;
  description: string;
  priority?: TicketPriority;
  orderId?: ID;
  attachments?: File[];
}

/**
 * Reply ticket message request
 */
export interface ReplyTicketRequest {
  content: string;
  attachments?: File[];
}

// Re-export PaginatedResponse for convenience
export type { PaginatedResponse };
