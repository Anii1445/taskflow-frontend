import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsAPI } from '../api';
import toast from 'react-hot-toast';

export const useComments = (taskId) =>
  useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => commentsAPI.getAll(taskId).then((r) => r.data),
    enabled: !!taskId,
  });

export const useAddComment = (taskId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => commentsAPI.create(taskId, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', taskId] }),
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add comment'),
  });
};

export const useEditComment = (taskId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, ...data }) => commentsAPI.update(taskId, commentId, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', taskId] }),
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to edit comment'),
  });
};

export const useDeleteComment = (taskId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => commentsAPI.delete(taskId, commentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', taskId] });
      toast.success('Comment deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete comment'),
  });
};
