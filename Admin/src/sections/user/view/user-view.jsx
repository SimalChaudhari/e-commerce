import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Divider,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Grid,
    Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// View Page Dialog for displaying user details
export function UserViewDialog({ open, onClose, userView }) {
    if (!userView) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    User Profile
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* User Profile Section */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 4,
                        flexWrap: 'wrap',
                        justifyContent: { xs: 'center', sm: 'flex-start' },
                    }}
                >
                    <Avatar
                        alt={userView.firstName}
                        src={userView.profileUrl || '/path-to-placeholder-image'}
                        sx={{
                            width: { xs: 80, sm: 100 },
                            height: { xs: 80, sm: 100 },
                            mr: { xs: 0, sm: 3 },
                            mb: { xs: 2, sm: 0 },
                            border: '3px solid',
                            borderColor: 'primary.main',
                        }}
                    />
                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {`${userView.firstName} ${userView.lastName}`}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {userView.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Role: {userView.role || 'Not specified'}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* User Information Section */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Contact Information
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                <PhoneIcon sx={{ mr: 1 }} />
                                Mobile:
                            </Typography>
                            <Typography variant="body1">{userView.mobile || 'Not provided'}</Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                <EmailIcon sx={{ mr: 1 }} />
                                Email:
                            </Typography>
                            <Typography variant="body1">{userView.email || 'Not provided'}</Typography>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Status Section */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        Status:
                        {userView.status === 'Active' ? (
                            <CheckCircleIcon sx={{ color: 'green', ml: 1 }} />
                        ) : (
                            <CancelIcon sx={{ color: 'red', ml: 1 }} />
                        )}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: userView.status === 'Active' ? 'success.main' : 'error.main',
                            fontWeight: 'bold',
                        }}
                    >
                        {userView.status}
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Additional Information (if needed) */}
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Additional Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {/* Placeholder for additional information or fields */}
                        Any other information about the user can be displayed here.
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
