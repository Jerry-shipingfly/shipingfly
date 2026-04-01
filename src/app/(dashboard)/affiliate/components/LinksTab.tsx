'use client';

import React from 'react';
import { Gift, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardBody, CardHeader, Badge } from '@/components/ui';
import { ReferralLink } from './ReferralLink';
import { cn } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

// Mock data
const mockReferralData = {
  link: 'https://hyperzone.com/ref/ABC123XYZ',
  code: 'ABC123XYZ',
  stats: {
    totalReferrals: 128,
    activeReferrals: 45,
    totalEarnings: 2560.00,
    pendingEarnings: 320.00,
  },
};

export default function LinksTab() {
  const { t } = useTranslation();

  const statsCards = [
    {
      key: 'totalReferrals',
      label: t('affiliate.totalReferrals'),
      value: mockReferralData.stats.totalReferrals,
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      key: 'activeReferrals',
      label: t('affiliate.activeReferrals'),
      value: mockReferralData.stats.activeReferrals,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      key: 'totalEarnings',
      label: t('affiliate.totalEarnings'),
      value: `$${mockReferralData.stats.totalEarnings.toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-primary-500',
      bgColor: 'bg-primary-100',
    },
    {
      key: 'pendingEarnings',
      label: t('affiliate.pendingEarnings'),
      value: `$${mockReferralData.stats.pendingEarnings.toFixed(2)}`,
      icon: <Gift className="w-6 h-6" />,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <Card key={card.key} shadow="sm">
            <CardBody className="p-4">
              <div className="flex items-center gap-4">
                <div className={cn('p-3 rounded-lg', card.bgColor)}>
                  <div className={card.color}>{card.icon}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Referral link card */}
      <Card shadow="sm">
        <CardHeader bordered>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary-500" />
            <span>{t('affiliate.myReferralLink')}</span>
          </div>
          <Badge variant="primary">{t('affiliate.rewardRules')}</Badge>
        </CardHeader>
        <CardBody>
          <ReferralLink
            link={mockReferralData.link}
            code={mockReferralData.code}
          />
        </CardBody>
      </Card>

      {/* Reward rules description */}
      <Card shadow="sm">
        <CardHeader bordered>
          {t('affiliate.referralRewardRules')}
        </CardHeader>
        <CardBody>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <p>
                <span className="font-medium text-gray-900">{t('affiliate.shareLink')}</span>
                <br />
                {t('affiliate.shareLinkHint')}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <p>
                <span className="font-medium text-gray-900">{t('affiliate.friendRegistration')}</span>
                <br />
                {t('affiliate.friendRegistrationHint')}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <p>
                <span className="font-medium text-gray-900">{t('affiliate.earnRewards')}</span>
                <br />
                {t('affiliate.earnRewardsHint')}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
