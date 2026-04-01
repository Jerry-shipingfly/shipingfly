'use client';

import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Notification settings page
 * @description Configure notification receiving channels for different notification types
 */
export default function NotificationPage() {
  const { t } = useTranslation();

  // Notification type definitions
  const notificationTypes = [
    {
      key: 'order',
      label: t('settings.orderNotifications'),
      description: t('settings.orderNotificationsHint'),
    },
    {
      key: 'system',
      label: t('settings.systemNotifications'),
      description: t('settings.systemNotificationsHint'),
    },
    {
      key: 'marketing',
      label: t('settings.marketingNotifications'),
      description: t('settings.marketingNotificationsHint'),
    },
  ];

  // Notification channel definitions
  const notificationChannels = [
    {
      key: 'inApp',
      label: t('settings.inApp'),
      icon: <Bell className="w-5 h-5" />,
    },
    {
      key: 'email',
      label: t('settings.email'),
      icon: <Mail className="w-5 h-5" />,
    },
    {
      key: 'sms',
      label: t('settings.sms'),
      icon: <Smartphone className="w-5 h-5" />,
    },
  ];

  // Initialize notification settings state
  const [settings, setSettings] = useState<Record<string, Record<string, boolean>>>({
    order: { inApp: true, email: true, sms: false },
    system: { inApp: true, email: true, sms: true },
    marketing: { inApp: true, email: false, sms: false },
  });

  // Toggle notification switch
  const handleToggle = (type: string, channel: string) => {
    setSettings((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [channel]: !prev[type][channel],
      },
    }));
  };

  // Save settings
  const handleSave = () => {
    console.log('Save notification settings:', settings);
    // TODO: Call API to save settings
  };

  return (
    <div className="space-y-6">
      {/* Header description */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">{t('settings.notificationSettings')}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {t('settings.notificationSettingsHint')}
        </p>
      </div>

      {/* Notification settings table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div className="px-4 py-3">
              <span className="text-sm font-medium text-gray-700">{t('settings.notificationType')}</span>
            </div>
            {notificationChannels.map((channel) => (
              <div
                key={channel.key}
                className="px-4 py-3 text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-500">{channel.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {channel.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table body */}
        <div className="divide-y divide-gray-100">
          {notificationTypes.map((type) => (
            <div key={type.key} className="grid grid-cols-4 gap-4 hover:bg-gray-50">
              {/* Type info */}
              <div className="px-4 py-4">
                <div>
                  <span className="font-medium text-gray-900">{type.label}</span>
                  <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                </div>
              </div>

              {/* Channel switches */}
              {notificationChannels.map((channel) => (
                <div
                  key={channel.key}
                  className="px-4 py-4 flex items-center justify-center"
                >
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings[type.key]?.[channel.key] ?? false}
                      onChange={() => handleToggle(type.key, channel.key)}
                    />
                    <div
                      className={cn(
                        'w-11 h-6 rounded-full peer transition-colors',
                        'after:content-[""] after:absolute after:top-0.5 after:left-0.5',
                        'after:bg-white after:rounded-full after:h-5 after:w-5',
                        'after:transition-transform peer-checked:after:translate-x-full',
                        settings[type.key]?.[channel.key]
                          ? 'bg-primary-500'
                          : 'bg-gray-200'
                      )}
                    />
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
        >
          {t('settings.saveSettings')}
        </button>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Bell className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">{t('settings.importantNotice')}</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>{t('settings.notificationTip1')}</li>
              <li>{t('settings.notificationTip2')}</li>
              <li>{t('settings.notificationTip3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
