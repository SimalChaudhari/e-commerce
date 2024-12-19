import { Helmet } from 'react-helmet-async';
import useUserRole from 'src/layouts/components/user-role';
import { Overview } from 'src/sections/overview/adminDash/view';
import { OverviewBookingView } from 'src/sections/overview/booking/view';


export default function OverviewAppPage() {

  const role = useUserRole()

  const metadata = { title: `Dashboard - ${role}` };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      {role === "Admin" ? <Overview /> :
        <OverviewBookingView />
      }

    </>
  );
}