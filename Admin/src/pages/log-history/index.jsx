
import { Helmet } from 'react-helmet-async';
import useUserRole from "src/layouts/components/user-role";
import { LogListView } from 'src/sections/logs-history/view';

export default function Page() {

    const role = useUserRole()

    const metadata = { title: `Logs - ${role}` };
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <LogListView/>
        </>
    );
}
