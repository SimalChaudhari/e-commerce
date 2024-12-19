
import { UserListView } from 'src/sections/user/view';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';

const metadata = { title: `Users - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <UserListView />
        </>
    );
}
