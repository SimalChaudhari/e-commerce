import { ProductListView } from "src/sections/product/view";
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { StockListView } from "src/sections/stock-summary/view";

const metadata = { title: `Stock Summary - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <StockListView />
        </>
    );
}
