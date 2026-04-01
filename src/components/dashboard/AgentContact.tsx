/**
 * Agent Contact Component
 * @description Display agent WhatsApp contact in dashboard header
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Agent information
 */
interface AgentInfo {
  id: string;
  name: string;
  whatsappNumber: string;
  avatar?: string;
}

/**
 * AgentContact Props
 */
export interface AgentContactProps {
  className?: string;
}

/**
 * Fetch agent info API (placeholder)
 * TODO: Replace with actual API call
 */
async function fetchAgentInfo(): Promise<AgentInfo | null> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data - replace with actual API endpoint
  return {
    id: '1',
    name: 'Support Agent',
    whatsappNumber: '+1234567890', // TODO: Get from API
    avatar: undefined,
  };
}

/**
 * Format WhatsApp number for display
 */
function formatWhatsAppNumber(number: string): string {
  // Remove + and format for display
  const cleaned = number.replace(/\D/g, '');
  if (cleaned.length >= 10) {
    // Format as +1 (234) 567-8900
    const countryCode = cleaned.slice(0, -10);
    const areaCode = cleaned.slice(-10, -7);
    const firstPart = cleaned.slice(-7, -4);
    const secondPart = cleaned.slice(-4);
    return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
  }
  return number;
}

/**
 * Generate WhatsApp chat URL
 */
function getWhatsAppUrl(number: string): string {
  const cleaned = number.replace(/\D/g, '');
  return `https://wa.me/${cleaned}`;
}

/**
 * AgentContact Component
 */
export const AgentContact: React.FC<AgentContactProps> = ({ className }) => {
  const { t } = useTranslation();
  const [agent, setAgent] = useState<AgentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentInfo();
  }, []);

  const loadAgentInfo = async () => {
    try {
      const info = await fetchAgentInfo();
      setAgent(info);
    } catch (error) {
      console.error('Failed to load agent info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('flex items-center gap-2 px-3 py-2', className)}>
        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <a
      href={getWhatsAppUrl(agent.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-2',
        'px-3 py-2 rounded-lg',
        'bg-green-50 hover:bg-green-100',
        'border border-green-200',
        'transition-colors duration-200',
        'group',
        className
      )}
      title={t('dashboard.contactAgent') || 'Contact Agent'}
    >
      {/* WhatsApp Icon */}
      <div className="relative w-5 h-5 flex-shrink-0">
        <Image
          src="/icons/whatsapp.svg"
          alt="WhatsApp"
          fill
          className="object-contain"
        />
      </div>

      {/* Label and Number */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-gray-600 font-medium">
          {t('dashboard.myAgent')}:
        </span>
        <span className="text-green-600 font-semibold group-hover:underline">
          {formatWhatsAppNumber(agent.whatsappNumber)}
        </span>
      </div>
    </a>
  );
};

export default AgentContact;
