
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import ContactEditForm from 'src/sections/setting/Contact-us/view/contact-edit-form';

const metadata = { title: `Contact Us - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <ContactEditForm />
        </>
    );
}
