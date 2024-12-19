// useUserRole.js
import { useEffect, useState } from 'react';

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const role = userData?.user?.role;
    setUserRole(role);
  }, []);

  return userRole;
};

export default useUserRole;
