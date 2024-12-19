import { Helmet } from 'react-helmet-async';
import useUserRole from 'src/layouts/components/user-role';
import { ReceivablesListView } from 'src/sections/accounting/Receivables/view';

export default function Page() {

    const role = useUserRole()

    const metadata = { title: `Outstanding Receivables - ${role}` };

    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <ReceivablesListView/>
        </>
    );
}
