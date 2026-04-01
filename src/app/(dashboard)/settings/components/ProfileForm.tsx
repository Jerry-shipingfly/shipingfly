'use client';

import React, { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { cn } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * User profile form data
 */
export interface ProfileFormData {
  /** Avatar URL */
  avatar: string;
  /** Username */
  name: string;
  /** Email */
  email: string;
  /** Phone */
  phone: string;
}

/**
 * Password form data
 */
export interface PasswordFormData {
  /** Current password */
  currentPassword: string;
  /** New password */
  newPassword: string;
  /** Confirm password */
  confirmPassword: string;
}

/**
 * ProfileForm component Props interface
 */
export interface ProfileFormProps {
  /** Initial data */
  initialData?: ProfileFormData;
  /** Save profile callback */
  onSaveProfile?: (data: ProfileFormData) => Promise<void>;
  /** Change password callback */
  onChangePassword?: (data: PasswordFormData) => Promise<void>;
  /** Custom styles */
  className?: string;
}

/**
 * Profile Form Component
 * @description Includes avatar upload, basic information editing, and password change functionality
 */
export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData = {
    avatar: '',
    name: '',
    email: '',
    phone: '',
  },
  onSaveProfile,
  onChangePassword,
  className,
}) => {
  const { t } = useTranslation();

  // Profile form state
  const [profileData, setProfileData] = useState<ProfileFormData>(initialData);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Password form state
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Password form errors
  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordFormData>>({});

  // Avatar upload ref
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  // Handle avatar selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Actually upload to server
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData((prev) => ({
          ...prev,
          avatar: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile field change
  const handleProfileChange = (field: keyof ProfileFormData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle password field change
  const handlePasswordChange = (field: keyof PasswordFormData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setPasswordErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Validate password form
  const validatePasswordForm = (): boolean => {
    const errors: Partial<PasswordFormData> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = t('settings.validation.enterCurrentPassword');
    }

    if (!passwordData.newPassword) {
      errors.newPassword = t('settings.validation.enterNewPassword');
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = t('settings.validation.passwordMinLength');
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = t('settings.validation.confirmNewPassword');
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = t('settings.validation.passwordsDoNotMatch');
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save profile
  const handleSaveProfile = async () => {
    if (!onSaveProfile) return;

    setIsProfileLoading(true);
    try {
      await onSaveProfile(profileData);
      // TODO: Show success notification
    } catch (error) {
      console.error('Failed to save profile:', error);
      // TODO: Show error notification
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!validatePasswordForm() || !onChangePassword) return;

    setIsPasswordLoading(true);
    try {
      await onChangePassword(passwordData);
      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      // TODO: Show success notification
    } catch (error) {
      console.error('Failed to change password:', error);
      // TODO: Show error notification
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Avatar Upload */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt={t('settings.avatar')}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Camera className="w-8 h-8" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors shadow-sm"
            aria-label={t('settings.uploadAvatar')}
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{t('settings.avatar')}</p>
          <p className="text-sm text-gray-500 mt-1">
            {t('settings.avatarHint')}
          </p>
        </div>
      </div>

      {/* Basic Information Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          {t('settings.basicInfo')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('settings.name')}
            placeholder={t('settings.enterName')}
            value={profileData.name}
            onChange={(e) => handleProfileChange('name', e.target.value)}
          />

          <Input
            label={t('settings.email')}
            type="email"
            placeholder={t('settings.enterEmail')}
            value={profileData.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
          />

          <Input
            label={t('settings.phone')}
            type="tel"
            placeholder={t('settings.enterPhone')}
            value={profileData.phone}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            variant="primary"
            onClick={handleSaveProfile}
            loading={isProfileLoading}
            disabled={isProfileLoading}
          >
            {isProfileLoading ? t('settings.saving') : t('settings.saveProfile')}
          </Button>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          {t('settings.changePassword')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('settings.currentPassword')}
            type="password"
            placeholder={t('settings.enterCurrentPassword')}
            value={passwordData.currentPassword}
            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
            error={passwordErrors.currentPassword}
          />

          <div />

          <Input
            label={t('settings.newPassword')}
            type="password"
            placeholder={t('settings.enterNewPassword')}
            value={passwordData.newPassword}
            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            error={passwordErrors.newPassword}
          />

          <Input
            label={t('settings.confirmPassword')}
            type="password"
            placeholder={t('settings.enterNewPasswordAgain')}
            value={passwordData.confirmPassword}
            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            error={passwordErrors.confirmPassword}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            variant="secondary"
            onClick={handleChangePassword}
            loading={isPasswordLoading}
            disabled={isPasswordLoading}
          >
            {isPasswordLoading ? t('settings.changing') : t('settings.changePasswordBtn')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
