import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box, Typography, TextField, Button, Paper,
  InputAdornment, IconButton, Alert, Divider,
} from '@mui/material';
import { EmailRounded, LockRounded, VisibilityRounded, VisibilityOffRounded } from '@mui/icons-material';
import { useLogin } from '../hooks/useAuth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const loginMutation = useLogin();

  const onSubmit = (data) => loginMutation.mutate(data);

  const fillDemo = (role) => {
    if (role === 'admin') {
      setValue('email', 'ankit@gmail.com');
      setValue('password', 'Ankit@1445');
    } else {
      setValue('email', 'shubham@gmail.com');
      setValue('password', 'Shubham@1445');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: 'background.default', p: 2,
      background: 'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.12) 0%, transparent 70%)',
    }}>
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: 3,
            background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
          }}>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 26 }}>T</Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>Welcome back</Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: 14 }}>Sign in to your TaskFlow account</Typography>
        </Box>

        <Paper sx={{ p: 3.5, borderRadius: 3 }}>
          {/* Demo Buttons */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
              Quick Demo
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" onClick={() => fillDemo('admin')} sx={{ flex: 1, fontSize: 12 }}>
                Admin Account
              </Button>
              <Button variant="outlined" size="small" onClick={() => fillDemo('member')} sx={{ flex: 1, fontSize: 12 }}>
                Member Account
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>or enter manually</Typography>
          </Divider>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email"
                fullWidth
                size="small"
                autoComplete="email"
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
                autoComplete="current-password"
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
                {...register('password', { required: 'Password is required' })}
              />

              {loginMutation.isError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {loginMutation.error?.response?.data?.message || 'Login failed'}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                loading={loginMutation.isPending}
                disabled={loginMutation.isPending}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                {loginMutation.isPending ? 'Signing in…' : 'Sign In'}
              </Button>
            </Box>
          </form>
        </Paper>

        <Typography sx={{ textAlign: 'center', mt: 3, color: 'text.secondary', fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#6c63ff', fontWeight: 700, textDecoration: 'none' }}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
