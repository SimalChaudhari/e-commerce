import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from 'src/store/action/authActions';
import ConfirmDialog from 'src/components/logout/confirm-dialog';
import { Backdrop, CircularProgress } from '@mui/material';

const metadata = { title: `Logout - ${CONFIG.site.name}` };

export default function LogoutConfirmation() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(true); // Dialog opens immediately
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true); // Show loading spinner while logging out
        const log = await dispatch(logout());
        if (log) {
            navigate('/auth/sign-in'); // Navigate to the sign-in page after successful logout
        }
    };

    const handleCancel = () => {
        setOpenConfirmDialog(false); // Close the confirmation dialog
        navigate(-1); // Go back to the previous route
    };

    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            {/* Backdrop to dim the background */}
            <Backdrop open={openConfirmDialog} sx={{ color: '#fff', zIndex: 1200 }}>
                {/* Show loading spinner while waiting for logout */}
                {loading ? <CircularProgress color="inherit" /> : null}
            </Backdrop>

            {/* Show the confirmation dialog */}
            <ConfirmDialog
                open={openConfirmDialog}
                onClose={handleCancel}
                onConfirm={handleLogout}
                title="Are you sure you want to logout?"
                content="This will log you out of your account. Please confirm if you want to proceed."
            />
        </>
    );
}
