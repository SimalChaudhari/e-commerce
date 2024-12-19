import { FAQsListView } from "src/sections/setting/FAQ/view";
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';


const metadata = { title: `FAQ - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>
            <FAQsListView />
        </>
    );
}
