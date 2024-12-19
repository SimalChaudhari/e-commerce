import Alert from '@mui/material/Alert';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import { CONFIG } from 'src/config-global';
import { Section } from './section';
import { Main, Content } from './main';
import { HeaderBase } from '../core/header-base';
import { LayoutSection } from '../core/layout-section';

export function AuthSplitLayout({ sx, section = {}, children }) {
  const mobileNavOpen = useBoolean();

  // Define a query for layout responsiveness
  const layoutQuery = 'md';

  return (
    <LayoutSection
      /** **************************************
       * Header Section
       *************************************** */
      headerSection={
        <HeaderBase
          disableElevation
          layoutQuery={layoutQuery}
          onOpenNav={mobileNavOpen.onTrue}
          slotsDisplay={{
            signIn: false,
            account: false,
            purchase: false,
            contacts: false,
            searchbar: false,
            workspaces: false,
            menuButton: false,
            localization: false,
            notifications: false,
          }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info alert.
              </Alert>
            ),
          }}
          slotProps={{ container: { maxWidth: false } }}
          sx={{ position: { [layoutQuery]: 'fixed' } }}
        />
      }

      /** **************************************
       * Footer Section (Currently set to null)
       *************************************** */
      footerSection={null}

      /** **************************************
       * Style & Custom CSS Vars
       *************************************** */
      sx={sx}
      cssVars={{
        '--layout-auth-content-width': '420px',
      }}
    >
      <Main layoutQuery={layoutQuery}>
        <Section
          title={section.title} // Provide fallback for missing section prop
          layoutQuery={layoutQuery}
          imgUrl={section.imgUrl}
          method={CONFIG.auth.method}
          methods={[
            {
              label: 'Jwt',
              path: paths.auth.jwt.signIn,
              icon: `${CONFIG.site.basePath}/assets/icons/platforms/ic-jwt.svg`,
            },
          ]}
        />
        <Content layoutQuery={layoutQuery}>{children}</Content>
      </Main>
    </LayoutSection>
  );
}
