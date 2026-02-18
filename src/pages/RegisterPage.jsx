import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box, Typography, TextField, Button, Paper,
  InputAdornment, IconButton, Alert, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { PersonRounded, EmailRounded, LockRounded, VisibilityRounded, VisibilityOffRounded } from '@mui/icons-material';
import { useRegister } from '../hooks/useAuth';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm({ defaultValues: { role: 'member' } });
  const registerMutation = useRegister();

  const onSubmit = (data) => registerMutation.mutate(data);

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: 'background.default', p: 2,
      background: 'radial-gradient(ellipse at 50% 0%, rgba(255,101,132,0.1) 0%, transparent 70%)',
    }}>
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: 3,
            background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
          }}>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 26 }}>T</Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Create your account</Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: 14 }}>Start managing tasks with your team</Typography>
        </Box>

        <Paper sx={{ p: 3.5, borderRadius: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Full Name"
                fullWidth
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonRounded sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
              />

              <TextField
                label="Email"
                fullWidth
                size="small"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailRounded sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                })}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                size="small"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockRounded sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffRounded sx={{ fontSize: 18 }} /> : <VisibilityRounded sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
              />

              <FormControl size="small" fullWidth>
                <InputLabel>Role</InputLabel>
                <Select defaultValue="member" label="Role" {...register('role')}>
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>

              {registerMutation.isError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {registerMutation.error?.response?.data?.message || 'Registration failed'}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={registerMutation.isPending}
                sx={{ borderRadius: 2, fontWeight: 700, bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
              >
                {registerMutation.isPending ? 'Creating account…' : 'Create Account'}
              </Button>
            </Box>
          </form>
        </Paper>

        <Typography sx={{ textAlign: 'center', mt: 3, color: 'text.secondary', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6c63ff', fontWeight: 700, textDecoration: 'none' }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
