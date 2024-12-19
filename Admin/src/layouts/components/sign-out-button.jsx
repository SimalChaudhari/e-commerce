
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router';
import { logout } from 'src/store/action/authActions';

export function SignOutButton() {

  const dispatch = useDispatch();

  const handleLogout = async () => {
    const log = await dispatch(logout());
    if (log) {
      Navigate('/sign-in')
    }
  };

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
