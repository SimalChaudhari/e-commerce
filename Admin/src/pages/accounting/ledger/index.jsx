import { Helmet } from 'react-helmet-async';
import useUserRole from 'src/layouts/components/user-role';
import { LedgerListView } from 'src/sections/accounting/ledger/view';


export default function Page() {

    const role = useUserRole()

    const metadata = { title: `Ledger Statement - ${role}` };

    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <LedgerListView />
        </>
    );
}
