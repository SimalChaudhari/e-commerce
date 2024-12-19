
import { Helmet } from 'react-helmet-async';
import useUserRole from 'src/layouts/components/user-role';
import { UserProfileView } from 'src/sections/vendor-sections/setting/profile/view';


export default function Page() {
    const role = useUserRole()
    const metadata = { title: `profile - ${role}` };
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>
            <UserProfileView/>
        </>
    );
}
