/**
 * Ticket Module Mock Data
 */

import { Ticket, TicketDetail, TicketMessage } from '@/types/ticket.types';

/**
 * Simulate network delay
 */
export const simulateDelay = (ms: number = 600): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));


/**
 * Simulate error
 */
export const simulateError = (message: string = 'Mock error'): never => {
  throw new Error(message);
};

/**
 * Mock ticket data
 */
export const MOCK_TICKETS: Ticket[] = [
  {
    id: 't1',
    ticketNumber: 'TKT-2024-00001',
    type: 'aftersales',
    subject: 'Product damaged on arrival, requesting refund',
    description: 'Customer reported receiving a damaged product and requested a return and refund. The product is Wireless Bluetooth Earbuds Pro, the order was shipped but the customer found the product not working properly after receiving it.',
    status: 'in_progress',
    priority: 'high',
    orderNumber: 'ORD-2024-00001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    messages: [
      {
        id: 'm1',
        ticketId: 't1',
        content: 'I received the product on March 25 and found that some parts are not working.',
        sender: 'customer',
        senderName: 'John Smith',
        createdAt: '2024-03-25T09:30:00Z',
      },
      {
        id: 'm2',
        ticketId: 't1',
        content: 'Hello, we have received your feedback. We are verifying the order information, please provide the order number for us to check. Thank you.',
        sender: 'agent',
        senderName: 'Support Agent Mike',
        createdAt: '2024-03-26T10:15:00Z',
      },
      {
        id: 'm3',
        ticketId: 't1',
        content: 'After verification, order ORD-2024-00001 is a valid order, and a refund process has been arranged. The refund will be returned to your payment account within 3-5 business days.',
        sender: 'agent',
        senderName: 'Support Agent Mike',
        createdAt: '2024-03-27T14:00:00Z',
      },
      {
        id: 'm4',
        ticketId: 't1',
        content: 'The refund has been processed, the amount will be returned to the original payment account within 3-5 business days. Thank you for your understanding.',
        sender: 'customer',
        senderName: 'John Smith',
        createdAt: '2024-03-28T16:30:00Z',
      },
    ],
    createdAt: '2024-03-25T09:30:00Z',
    updatedAt: '2024-03-28T16:35:00Z',
  },
  {
    id: 't2',
    ticketNumber: 'TKT-2024-00002',
    type: 'complaint',
    subject: 'Delivery is too slow',
    description: 'Order placed on March 20, still haven\'t received the goods, requesting faster delivery',
    status: 'waiting_customer',
    priority: 'high',
    orderNumber: 'ORD-2024-00002',
    customerName: 'David Johnson',
    customerEmail: 'david.johnson@example.com',
    createdAt: '2024-03-20T10:00:00Z',
    messages: [
      {
        id: 'm5',
        ticketId: 't2',
        content: 'Delivery is too slow, order placed on March 20, still haven\'t received the goods.',
        sender: 'customer',
        senderName: 'David Johnson',
        createdAt: '2024-03-20T10:30:00Z',
      },
      {
        id: 'm6',
        ticketId: 't2',
        content: 'Hello, we are urging the logistics to deliver as soon as possible. Thank you for your understanding.',
        sender: 'agent',
        senderName: 'Support Agent Lisa',
        createdAt: '2024-03-21T11:00:00Z',
      },
      {
        id: 'm7',
        ticketId: 't2',
        content: 'We have verified with the logistics company, the order package has been shipped and is expected to arrive tomorrow. Please keep an eye out for delivery.',
        sender: 'agent',
        senderName: 'Support Agent Lisa',
        createdAt: '2024-03-21T14:30:00Z',
      },
      {
        id: 'm8',
        ticketId: 't2',
        content: 'Goods received, thank you for the feedback! Hope to speed up the processing flow.',
        sender: 'customer',
        senderName: 'David Johnson',
        createdAt: '2024-03-22T15:00:00Z',
      },
    ],
    resolvedAt: '2024-03-22T15:00:00Z',
    updatedAt: '2024-03-22T15:10:00Z',
  },
  {
    id: 't3',
    ticketNumber: 'TKT-2024-00003',
    type: 'suggestion',
    subject: 'Suggestion to improve search functionality',
    description: 'Would like to add search by order number for quick order lookup',
    status: 'open',
    priority: 'low',
    customerName: 'Robert Williams',
    customerEmail: 'robert.williams@example.com',
    messages: [
      {
        id: 'm9',
        ticketId: 't3',
        content: 'Suggesting to add search by order number functionality',
        sender: 'customer',
        senderName: 'Robert Williams',
        createdAt: '2024-03-15T10:20:00Z',
      },
    ],
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T10:35:00Z',
  },
  {
    id: 't4',
    ticketNumber: 'TKT-2024-00004',
    type: 'aftersales',
    subject: 'Request for return and refund',
    description: 'Product quality issue, need return and refund processing',
    status: 'open',
    priority: 'high',
    orderNumber: 'ORD-2024-00004',
    customerName: 'Michael Brown',
    customerEmail: 'michael.brown@example.com',
    messages: [
      {
        id: 'm10',
        ticketId: 't4',
        content: 'Received product with quality issues, requesting return and refund',
        sender: 'customer',
        senderName: 'Michael Brown',
        createdAt: '2024-03-28T10:15:00Z',
      },
      {
        id: 'm11',
        ticketId: 't4',
        content: 'Hello, we have received your request. Please provide the order number, we will process it within 24 hours.',
        sender: 'agent',
        senderName: 'Support Agent Sarah',
        createdAt: '2024-03-28T10:30:00Z',
      },
    ],
    createdAt: '2024-03-28T10:30:00Z',
    updatedAt: '2024-03-29T09:15:00Z',
    resolvedAt: '2024-03-29T09:20:00Z',
  },
  {
    id: 't5',
    ticketNumber: 'TKT-2024-00005',
    type: 'technical',
    subject: 'Unable to login to system',
    description: 'Login keeps showing "Network Error", cannot use the system normally',
    status: 'resolved',
    priority: 'medium',
    orderNumber: 'ORD-2024-00005',
    customerName: 'James Davis',
    customerEmail: 'james.davis@example.com',
    messages: [
      {
        id: 'm12',
        ticketId: 't5',
        content: 'Login keeps showing "Network Error", cannot use the system normally',
        sender: 'customer',
        senderName: 'James Davis',
        createdAt: '2024-03-10T14:00:00Z',
      },
      {
        id: 'm13',
        ticketId: 't5',
        content: 'Hello, this looks like a network issue, please refresh the page or try again, or contact technical support for assistance. Thank you.',
        sender: 'agent',
        senderName: 'Technical Support',
        createdAt: '2024-03-10T14:30:00Z',
      },
      {
        id: 'm14',
        ticketId: 't5',
        content: 'Page has been refreshed and cache cleared, the issue has been resolved. If you have any other issues please feel free to contact us.',
        sender: 'agent',
        senderName: 'Technical Support',
        createdAt: '2024-03-10T15:30:00Z',
      },
      {
        id: 'm15',
        ticketId: 't5',
        content: 'Thank you very much for your feedback! The system is running normally now.',
        sender: 'customer',
        senderName: 'James Davis',
        createdAt: '2024-03-10T16:00:00Z',
      },
    ],
    createdAt: '2024-03-10T10:30:00Z',
    updatedAt: '2024-03-10T16:05:00Z',
    resolvedAt: '2024-03-10T16:00:00Z',
  },
  {
    id: 't6',
    ticketNumber: 'TKT-2024-00006',
    type: 'complaint',
    subject: 'Customer service attitude complaint',
    description: 'Very dissatisfied with the customer service attitude, requesting improvement',
    status: 'in_progress',
    priority: 'urgent',
    orderNumber: 'ORD-2024-00006',
    customerName: 'William Miller',
    customerEmail: 'william.miller@example.com',
    messages: [
      {
        id: 'm16',
        ticketId: 't6',
        content: 'Very dissatisfied with the customer service attitude, the customer service was very impatient when I consulted about an issue before, requesting improvement in service attitude',
        sender: 'customer',
        senderName: 'William Miller',
        createdAt: '2024-04-01T09:00:00Z',
      },
      {
        id: 'm17',
        ticketId: 't6',
        content: 'Hello Mr. Miller, we are very sorry for the unpleasant experience. We will take this issue seriously and improve our service quality. Please provide the specific ticket number, we will follow up on the processing result.',
        sender: 'agent',
        senderName: 'Support Supervisor',
        createdAt: '2024-04-01T10:30:00Z',
      },
    ],
    createdAt: '2024-04-01T09:00:00Z',
    updatedAt: '2024-04-01T10:35:00Z',
  },
];

/**
 * Mock ticket details
 */
export const MOCK_TICKET_DETAILS: TicketDetail[] = [
  {
    ...MOCK_TICKETS[0],
    customer: {
      id: 'cust-1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
    },
    messages: MOCK_TICKETS[0].messages,
  },
];
