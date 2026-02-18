import api from './axios';

// ─── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
  getMe:    ()     => api.get('/auth/me'),
  refresh:  (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// ─── Users ─────────────────────────────────────────────
export const usersAPI = {
  getAll:         (params) => api.get('/users', { params }),
  getById:        (id)     => api.get(`/users/${id}`),
  updateProfile:  (data)   => api.put('/users/profile', data),
  uploadAvatar:   (formData) => api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data)   => api.put('/users/password', data),
};

// ─── Projects ──────────────────────────────────────────
export const projectsAPI = {
  getAll:        (params)  => api.get('/projects', { params }),
  create:        (data)    => api.post('/projects', data),
  getById:       (id)      => api.get(`/projects/${id}`),
  update:        (id, data)=> api.put(`/projects/${id}`, data),
  delete:        (id)      => api.delete(`/projects/${id}`),
  addMember:     (id, data)=> api.post(`/projects/${id}/members`, data),
  removeMember:  (id, uid) => api.delete(`/projects/${id}/members/${uid}`),
  getActivity:   (id, params) => api.get(`/projects/${id}/activity`, { params }),
};

// ─── Tasks ─────────────────────────────────────────────
export const tasksAPI = {
  getAll:       (projectId, params) => api.get(`/projects/${projectId}/tasks`, { params }),
  create:       (projectId, data)   => api.post(`/projects/${projectId}/tasks`, data),
  getById:      (projectId, taskId) => api.get(`/projects/${projectId}/tasks/${taskId}`),
  update:       (projectId, taskId, data) => api.patch(`/projects/${projectId}/tasks/${taskId}`, data),
  reorder:      (projectId, tasks)  => api.patch(`/projects/${projectId}/tasks/reorder`, { tasks }),
  delete:       (projectId, taskId) => api.delete(`/projects/${projectId}/tasks/${taskId}`),
  uploadFile:   (projectId, taskId, formData) =>
    api.post(`/projects/${projectId}/tasks/${taskId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteFile:   (projectId, taskId, attachmentId) =>
    api.delete(`/projects/${projectId}/tasks/${taskId}/attachments/${attachmentId}`),
};

// ─── Comments ──────────────────────────────────────────
export const commentsAPI = {
  getAll:  (taskId)              => api.get(`/tasks/${taskId}/comments`),
  create:  (taskId, data)        => api.post(`/tasks/${taskId}/comments`, data),
  update:  (taskId, commentId, data) => api.patch(`/tasks/${taskId}/comments/${commentId}`, data),
  delete:  (taskId, commentId)   => api.delete(`/tasks/${taskId}/comments/${commentId}`),
};
