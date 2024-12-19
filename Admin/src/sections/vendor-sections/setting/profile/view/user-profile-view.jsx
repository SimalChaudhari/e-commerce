
import Card from '@mui/material/Card';
import { paths } from 'src/routes/paths';
import { useTabs } from 'src/hooks/use-tabs';
import { DashboardContent } from 'src/layouts/dashboard';
import { _userAbout, _userFeeds } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ProfileHome } from '../profile-home';
import { ProfileCover } from '../profile-cover';
import { useSelector } from 'react-redux';


// ----------------------------------------------------------------------

export function UserProfileView() {
   const { authUser } = useSelector((state) => state.auth);
  const tabs = useTabs('profile');

  return (
    <DashboardContent maxWidth="2xl">
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.root },
          { name: authUser.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3, height: 290 }}>
        <ProfileCover
          role={authUser.role}
          name={authUser?.name}
          avatarUrl='/assets/profile/pic.jpg'
          coverUrl='/assets/profile/ban2.jpg'
        />
      </Card>

      {tabs.value === 'profile' && <ProfileHome info={authUser}  />}

    </DashboardContent>
  );
}
