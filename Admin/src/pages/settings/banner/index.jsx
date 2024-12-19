
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { BannerListView } from 'src/sections/setting/banner/view/banner-list-view';

const metadata = { title: `Banner - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <BannerListView />
        </>
    );
}
