import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../api';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authAPI.login(data).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate('/dashboard');
      toast.success(`Welcome back, ${data.user.name}!`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Login failed'),
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authAPI.register(data).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate('/');
      toast.success('Account created! Welcome!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Registration failed'),
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSettled: () => {
      logout();
      navigate('/login');
      toast.success('Logged out');
    },
  });
};
