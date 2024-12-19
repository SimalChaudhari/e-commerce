
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { PrivacyListView } from "src/sections/setting/privacy-policy/view";

const metadata = { title: `Privacy Policy - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <PrivacyListView/>
        </>
    );
}
