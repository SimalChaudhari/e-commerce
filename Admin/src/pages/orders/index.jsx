
import { Helmet } from 'react-helmet-async';
import useUserRole from 'src/layouts/components/user-role';
import { OrderListView } from 'src/sections/order/view';


export default function Page() {

    const role = useUserRole()

    const metadata = { title: `Orders - ${role}` };

    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <OrderListView />
        </>
    );
}
