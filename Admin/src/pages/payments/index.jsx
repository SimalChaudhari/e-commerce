import { Helmet } from 'react-helmet-async';
import useUserRole from "src/layouts/components/user-role";
import { PaymentView } from 'src/sections/payments/payment-view';

export default function Page() {

    const role = useUserRole()

    const metadata = { title: `Payments - ${role}` };
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>
            <PaymentView/>
        </>
    );
}
