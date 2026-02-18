import React from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Chip,
  Table, TableHead, TableBody, TableRow, TableCell,
  TextField, InputAdornment, Skeleton, useTheme, Alert,
  TableContainer, Tooltip,
} from '@mui/material';
import { SearchRounded, PeopleRounded, AdminPanelSettingsRounded, PersonRounded } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { usersAPI } from '../api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function MembersPage() {
  const theme = useTheme();
  const [search, setSearch] = React.useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', { search }],
    queryFn: () => usersAPI.getAll({ search }).then((r) => r.data),
  });

  const users = data?.users || [];
  const totalUsers = data?.pagination?.total || 0;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const memberCount = users.filter((u) => u.role === 'member').length;

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
            Team Members
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Manage all registered users in the system
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: 2.5,
              bgcolor: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PeopleRounded sx={{ color: 'primary.main', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 500 }}>Total Users</Typography>
              {isLoading ? (
                <Skeleton width={40} height={32} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  {totalUsers}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: 2.5,
              bgcolor: 'rgba(247,151,30,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AdminPanelSettingsRounded sx={{ color: 'warning.main', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 500 }}>Admins</Typography>
              {isLoading ? (
                <Skeleton width={40} height={32} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  {adminCount}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: 2.5,
              bgcolor: 'rgba(67,233,123,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PersonRounded sx={{ color: 'success.main', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 500 }}>Members</Typography>
              {isLoading ? (
                <Skeleton width={40} height={32} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  {memberCount}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <TextField
            placeholder="Search by name or email..."
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {error && (
            <Alert severity="error" sx={{ m: 3 }}>
              Failed to load users: {error.response?.data?.message || error.message}
            </Alert>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, fontSize: 12, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 } }}>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Skeleton variant="circular" width={36} height={36} />
                          <Skeleton width="60%" height={20} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        {search ? 'No users found matching your search' : 'No users in the system'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user._id}
                      hover
                      sx={{ '&:last-child td': { border: 0 }, cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            src={user.avatar}
                            alt={user.name}
                            sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}
                          >
                            {user.name?.[0]}
                          </Avatar>
                          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{user.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            bgcolor: user.role === 'admin' ? 'rgba(247,151,30,0.15)' : 'rgba(67,233,123,0.15)',
                            color: user.role === 'admin' ? 'warning.main' : 'success.main',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: 11,
                            fontWeight: 700,
                            bgcolor: user.isActive ? 'rgba(67,233,123,0.15)' : 'rgba(128,128,170,0.15)',
                            color: user.isActive ? 'success.main' : 'text.secondary',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={dayjs(user.createdAt).format('MMM D, YYYY h:mm A')}>
                          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                            {dayjs(user.createdAt).fromNow()}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
