
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { SyncView } from 'src/sections/setting/sync/view/sync-view';

const metadata = { title: `Sync - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <SyncView/>
        </>
    );
}
