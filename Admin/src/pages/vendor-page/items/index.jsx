
import { Helmet } from 'react-helmet-async';
import useUserRole from 'src/layouts/components/user-role';
import { CheckoutListView } from 'src/sections/vendor-sections/checkout/view/checkout-list';

export default function Page() {

    const role = useUserRole()

    const metadata = { title: `Products - ${role}` };
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>
            <CheckoutListView/> 
        </>
    );
}
