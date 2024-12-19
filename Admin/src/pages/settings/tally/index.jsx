import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { TallyView } from 'src/sections/setting/tally/tally-view';

const metadata = { title: `Tally - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <TallyView/>
        </>
    );
}
