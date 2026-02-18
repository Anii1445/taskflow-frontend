import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, TextField, Button, IconButton, Typography, Avatar,
  Divider, Chip, Tooltip, Alert,
} from '@mui/material';
import { CloseRounded, DeleteRounded, PersonAddRounded } from '@mui/icons-material';
import { useUpdateProject, useDeleteProject, useAddMember, useRemoveMember } from '../../hooks/useProjects';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function ProjectSettingsDialog({ open, onClose, project }) {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStore();
  const [memberEmail, setMemberEmail] = React.useState('');

  const { register, handleSubmit } = useForm({
    defaultValues: { name: project?.name || '', description: project?.description || '' },
    values: { name: project?.name || '', description: project?.description || '' },
  });

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const addMember = useAddMember(project?._id);
  const removeMember = useRemoveMember(project?._id);

  const isOwner = project?.owner?._id === user?._id;
  const canManage = isAdmin() || isOwner;

  const onSubmit = (data) => {
    updateProject.mutate({ id: project._id, ...data }, { onSuccess: onClose });
  };

  const handleDelete = () => {
    if (window.confirm(`Delete project "${project.name}" and all its tasks? This cannot be undone.`)) {
      deleteProject.mutate(project._id, {
        onSuccess: () => { onClose(); navigate('/dashboard'); },
      });
    }
  };

  const handleAddMember = () => {
    if (!memberEmail.trim()) return;
    addMember.mutate({ email: memberEmail }, { onSuccess: () => setMemberEmail('') });
  };

  if (!project) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Project Settings</Typography>
        <IconButton size="small" onClick={onClose}><CloseRounded fontSize="small" /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <form id="settings-form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <TextField label="Project Name" fullWidth size="small" {...register('name', { required: true })} />
            <TextField label="Description" fullWidth size="small" multiline rows={2} {...register('description')} />
          </Box>
        </form>

        <Divider sx={{ my: 2 }} />

        {/* Members */}
        <Typography sx={{ fontWeight: 700, mb: 2 }}>Team Members ({project.members?.length || 0})</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
          {project.members?.map((member) => (
            <Box key={member._id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src={member.avatar} sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13 }}>
                {member.name?.[0]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{member.name}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{member.email}</Typography>
              </Box>
              {member._id === project.owner?._id && (
                <Chip label="Owner" size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700, bgcolor: 'rgba(247,151,30,0.15)', color: 'warning.main' }} />
              )}
              {canManage && member._id !== project.owner?._id && (
                <Tooltip title="Remove member">
                  <IconButton size="small" onClick={() => removeMember.mutate(member._id)} sx={{ color: 'error.main' }}>
                    <DeleteRounded sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ))}
        </Box>

        {canManage && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Invite by email"
              size="small"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddMember(); } }}
              fullWidth
              placeholder="user@example.com"
            />
            <Button
              variant="outlined" startIcon={<PersonAddRounded />}
              onClick={handleAddMember} disabled={addMember.isPending}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Invite
            </Button>
          </Box>
        )}

        {/* Danger Zone */}
        {canManage && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography sx={{ fontWeight: 700, color: 'error.main', mb: 1.5 }}>Danger Zone</Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
              Deleting this project will permanently remove all tasks, comments, and activity logs.
            </Alert>
            <Button variant="outlined" color="error" onClick={handleDelete} disabled={deleteProject.isPending}>
              Delete Project
            </Button>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 1 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button type="submit" form="settings-form" variant="contained" disabled={updateProject.isPending}>
          {updateProject.isPending ? 'Saving…' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
