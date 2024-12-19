import { ProductListView } from "src/sections/product/view";
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import useUserRole from "src/layouts/components/user-role";

export default function Page() {

    const role = useUserRole()

    const metadata = { title: `Products - ${role}` };
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>
            <ProductListView />
        </>
    );
}
