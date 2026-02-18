import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAPI } from '../api';
import toast from 'react-hot-toast';

export const useProjects = (params) =>
  useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectsAPI.getAll(params).then((r) => r.data),
  });

export const useProject = (id) =>
  useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsAPI.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useProjectActivity = (id, params) =>
  useQuery({
    queryKey: ['project-activity', id, params],
    queryFn: () => projectsAPI.getActivity(id, params).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => projectsAPI.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create project'),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => projectsAPI.update(id, data).then((r) => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['project', data.project?._id] });
      toast.success('Project updated!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update project'),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => projectsAPI.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete project'),
  });
};

export const useAddMember = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => projectsAPI.addMember(projectId, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Member added!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add member'),
  });
};

export const useRemoveMember = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId) => projectsAPI.removeMember(projectId, memberId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Member removed');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to remove member'),
  });
};
