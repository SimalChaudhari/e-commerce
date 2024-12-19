
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import useUserRole from 'src/layouts/components/user-role';
import { VendorListView } from 'src/sections/vendor/view';


export default function Page() {
    const role = useUserRole()
    const metadata = { title: `Vendors - ${role}` };
    
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <VendorListView />
        </>
    );
}
