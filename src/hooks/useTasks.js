import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '../api';
import toast from 'react-hot-toast';

export const useTasks = (projectId, params) =>
  useQuery({
    queryKey: ['tasks', projectId, params],
    queryFn: () => tasksAPI.getAll(projectId, params).then((r) => r.data),
    enabled: !!projectId,
  });

export const useTask = (projectId, taskId) =>
  useQuery({
    queryKey: ['task', projectId, taskId],
    queryFn: () => tasksAPI.getById(projectId, taskId).then((r) => r.data),
    enabled: !!projectId && !!taskId,
  });

export const useCreateTask = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => tasksAPI.create(projectId, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Task created!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create task'),
  });
};

export const useUpdateTask = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, ...data }) => tasksAPI.update(projectId, taskId, data).then((r) => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      if (data.task) qc.invalidateQueries({ queryKey: ['task', projectId, data.task._id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update task'),
  });
};

export const useReorderTasks = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tasks) => tasksAPI.reorder(projectId, tasks),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
  });
};

export const useDeleteTask = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId) => tasksAPI.delete(projectId, taskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Task deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete task'),
  });
};

export const useUploadTaskFile = (projectId, taskId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData) => tasksAPI.uploadFile(projectId, taskId, formData).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['task', projectId, taskId] });
      toast.success('File uploaded!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to upload file'),
  });
};
