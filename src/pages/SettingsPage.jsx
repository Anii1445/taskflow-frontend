import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  Avatar, Divider, Alert, useTheme, IconButton, Tooltip,
} from '@mui/material';
import { CameraAltRounded } from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import { useMutation } from '@tanstack/react-query';
import { usersAPI } from '../api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const theme = useTheme();
  const { user, setUser } = useAuthStore();
  const fileInputRef = React.useRef(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({ values: { name: user?.name || '' } });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
    watch,
  } = useForm();

  const updateProfile = useMutation({
    mutationFn: (data) => usersAPI.updateProfile(data).then((r) => r.data),
    onSuccess: (data) => { setUser(data.user); toast.success('Profile updated!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update profile'),
  });

  const changePassword = useMutation({
    mutationFn: (data) => usersAPI.changePassword(data).then((r) => r.data),
    onSuccess: () => { resetPassword(); toast.success('Password changed!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to change password'),
  });

  const uploadAvatar = useMutation({
    mutationFn: (formData) => usersAPI.uploadAvatar(formData).then((r) => r.data),
    onSuccess: (data) => { setUser(data.user); toast.success('Avatar updated!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to upload avatar'),
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    uploadAvatar.mutate(formData);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Settings</Typography>

      {/* Profile Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 3 }}>Profile</Typography>

          {/* Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={user?.avatar}
                sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28, fontWeight: 700 }}
              >
                {user?.name?.[0]}
              </Avatar>
              <Tooltip title="Change avatar">
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadAvatar.isPending}
                  sx={{
                    position: 'absolute', bottom: 0, right: 0, width: 24, height: 24,
                    bgcolor: 'primary.main', color: '#fff', border: `2px solid ${theme.palette.background.paper}`,
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  <CameraAltRounded sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 16 }}>{user?.name}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>{user?.email}</Typography>
              <Typography sx={{
                display: 'inline-block', mt: 0.5, px: 1, py: 0.25,
                bgcolor: user?.role === 'admin' ? 'rgba(108,99,255,0.15)' : 'rgba(67,233,123,0.15)',
                color: user?.role === 'admin' ? 'primary.main' : 'success.main',
                borderRadius: 1, fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
              }}>
                {user?.role}
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleProfileSubmit((d) => updateProfile.mutate(d))}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Full Name"
                size="small"
                sx={{ flex: 1 }}
                error={!!profileErrors.name}
                helperText={profileErrors.name?.message}
                {...registerProfile('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
              />
              <TextField label="Email" size="small" value={user?.email} disabled sx={{ flex: 1 }} />
            </Box>
            <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving…' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Card */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 3 }}>Change Password</Typography>
          <form onSubmit={handlePasswordSubmit((d) => changePassword.mutate(d))}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Current Password"
                type="password"
                size="small"
                fullWidth
                error={!!passwordErrors.currentPassword}
                helperText={passwordErrors.currentPassword?.message}
                {...registerPassword('currentPassword', { required: 'Current password is required' })}
              />
              <TextField
                label="New Password"
                type="password"
                size="small"
                fullWidth
                error={!!passwordErrors.newPassword}
                helperText={passwordErrors.newPassword?.message}
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                size="small"
                fullWidth
                error={!!passwordErrors.confirm}
                helperText={passwordErrors.confirm?.message}
                {...registerPassword('confirm', {
                  required: 'Please confirm your password',
                  validate: (val) => val === watch('newPassword') || 'Passwords do not match',
                })}
              />
              <Box>
                <Button type="submit" variant="contained" color="secondary" disabled={changePassword.isPending}>
                  {changePassword.isPending ? 'Changing…' : 'Change Password'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
