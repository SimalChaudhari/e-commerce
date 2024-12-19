import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { MenuItem, Typography } from '@mui/material';
import { USER_STATUS_OPTIONS } from 'src/_mock'; // Ensure this is your mock data for user statuses
import { Form, Field, schemaHelper } from 'src/components/hook-form'; // Custom components for form handling
import { createUser, editUser } from 'src/store/action/userActions'; // Import create and edit user actions
import { useDispatch } from 'react-redux';
import { useFetchUserData } from '../components';

// ----------------------------------------------------------------------

// Define available roles
const ROLE_OPTIONS = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Customer', label: 'Customer' },
    { value: 'Vendor', label: 'Vendor' },
];

// Validation schema for both adding and editing a user
const UserSchema = zod.object({
    firstName: zod.string().min(1, { message: 'First Name is required!' }),
    lastName: zod.string().min(1, { message: 'Last Name is required!' }),
    email: zod
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
    mobile: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    status: zod.string().min(1, { message: 'Status is required!' }),
    role: zod.string().min(1, { message: 'Role is required!' }), // Role is required
    profile: zod.instanceof(File).optional().nullable(), // Optional profile picture
});

// ----------------------------------------------------------------------
// Unified User Form Component for Add and Edit
export function UserForm({ open, onClose, userData }) {
    const dispatch = useDispatch();
    const { fetchData } = useFetchUserData(); // Destructure fetchData from the custom hook

    // Set default values based on whether userData is passed (for edit) or not (for create)
    const defaultValues = useMemo(
        () => ({
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            email: userData?.email || '',
            mobile: userData?.mobile || '',
            status: userData?.status || USER_STATUS_OPTIONS[0]?.value, // Default to first status option
            role: userData?.role || ROLE_OPTIONS[0]?.value, // Default to first role option
            profile: null, // Initialize profile picture as null
        }),
        [userData]
    );

    const methods = useForm({
        resolver: zodResolver(UserSchema),
        defaultValues,
    });

    const { reset, handleSubmit, formState: { isSubmitting } } = methods;

    // Reset form values when userData changes (for edit)
    useEffect(() => {
        if (userData) {
            reset(defaultValues); // Reset form with updated values when editing
        }
    }, [userData, reset, defaultValues]);

    // Handle form submission for both add and edit
    const onSubmit = handleSubmit(async (data) => {
        const formattedData = {
            ...data,
            profile: data.profile || userData?.profile, // Use existing profile if not updated
        };

        // If userData exists, it's an edit operation, otherwise it's an add operation
        if (userData) {
            const isSuccess = await dispatch(editUser(userData.id, formattedData));
            if (isSuccess) {
                reset();
                onClose();
                fetchData();
            }
        } else {
            const response = await dispatch(createUser(formattedData));
            if (response) {
                reset();
                onClose();
                fetchData();
            }
        }
    });

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>{userData ? 'Edit User' : 'Add User'}</DialogTitle>

                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        {userData ? 'Edit the details below to update the user.' : 'Please fill in the details below to create a new user.'}
                    </Alert>

                    <Box sx={{ mb: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Field.UploadAvatar name="profile" maxSize={3145728} />
                        <Typography variant="caption" sx={{ mt: 3, mx: 'auto', textAlign: 'center', color: 'text.disabled' }}>
                            Allowed *.jpeg, *.jpg, *.png, *.gif
                        </Typography>
                    </Box>

                    <Box display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} gap={3}>
                        <Field.Text name="firstName" label="First Name" />
                        <Field.Text name="lastName" label="Last Name" />
                        <Field.Text name="email" label="Email" />
                        <Field.Phone name="mobile" label="Mobile" />
                        <Field.Select name="status" label="Status">
                            {USER_STATUS_OPTIONS.map((status) => (
                                <MenuItem key={status.value} value={status.value}>
                                    {status.label}
                                </MenuItem>
                            ))}
                        </Field.Select>
                        <Field.Select name="role" label="Role">
                            {ROLE_OPTIONS.map((role) => (
                                <MenuItem key={role.value} value={role.value}>
                                    {role.label}
                                </MenuItem>
                            ))}
                        </Field.Select>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        {userData ? 'Update' : 'Create'}
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
