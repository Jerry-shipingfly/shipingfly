'use client';

import React from 'react';
import { ProfileForm, ProfileFormData, PasswordFormData } from '../components/ProfileForm';

/**
 * Profile settings page
 * @description User profile editing and password modification
 */
export default function ProfilePage() {
  // Mock user data
  const mockUserData: ProfileFormData = {
    avatar: '',
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+86 138 8888 8888',
  };

  // Save profile
  const handleSaveProfile = async (data: ProfileFormData) => {
    console.log('Save profile:', data);
    // TODO: Call API to save profile
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // Change password
  const handleChangePassword = async (data: PasswordFormData) => {
    console.log('Change password:', data);
    // TODO: Call API to change password
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <ProfileForm
      initialData={mockUserData}
      onSaveProfile={handleSaveProfile}
      onChangePassword={handleChangePassword}
    />
  );
}
