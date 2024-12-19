import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';
import { AuthGuard } from 'src/auth/guard';
import { ProductEditView, ProductView } from 'src/sections/product/view';
import { FAQCreateView, FAQEditView, FAQView } from 'src/sections/setting/FAQ/view';
import { VendorView } from 'src/sections/vendor/view/vendor-view';
import { VendorEditView } from 'src/sections/vendor/view/vendor-edit';
import { OrderDetailsView } from 'src/sections/order/view';
import { BannerCreateView, BannerEditView, BannerView } from 'src/sections/setting/banner/view';
import { ReceivablesListDetails } from 'src/sections/accounting/Receivables/view/receivables-details';
import { PaymentCreateView } from 'src/sections/payments/payment-form';
import { PaymentEditView } from 'src/sections/payments/payment-edit';
import { PaymentViewUi } from 'src/sections/payments/payment-vendor-view';
import { LedgerListDetails } from 'src/sections/accounting/ledger/view/ledger-details';
import { ProductCreateView } from 'src/sections/product/view/product-create';

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const UsersPage = lazy(() => import('src/pages/users'));
const ProductPage = lazy(() => import('src/pages/products'));
const StockPage = lazy(() => import('src/pages/stock-summary'));
const OrderPage = lazy(() => import('src/pages/orders'));
const LedgerPage = lazy(() => import('src/pages/accounting/ledger'));
const ReceivablesPage = lazy(() => import('src/pages/accounting/Receivables'));
const VendorPage = lazy(() => import('src/pages/vendors'));
const FAQPage = lazy(() => import('src/pages/settings/faq'));
const BannerPage = lazy(() => import('src/pages/settings/banner'));
const ContactPage = lazy(() => import('src/pages/settings/contact-us'));
const TermsPage = lazy(() => import('src/pages/settings/terms-conditions'));
const ProfilePage = lazy(() => import('src/pages/vendor-page/settings/profile'));
const LogoutPage = lazy(() => import('src/pages/settings/logout'));

const LogPage = lazy(() => import('src/pages/log-history'));

const PaymentPage = lazy(() => import('src/pages/payments'));



const SyncPage = lazy(() => import('src/pages/settings/sync'));
const TallyPage = lazy(() => import('src/pages/settings/tally'));


// Error
const Page500 = lazy(() => import('src/pages/error/500'));
const Page403 = lazy(() => import('src/pages/error/403'));
const Page404 = lazy(() => import('src/pages/error/404'));

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const adminRoute =[
    {
      path: 'dashboard',
      element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
      children: [
        { element: <IndexPage />, index: true },
      ],
    },
    {
      path: 'products',
      element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
      children: [
        { element: <ProductPage />, index: true },
        { path: 'create', element: <ProductCreateView/> },
        { path: 'edit/:id', element: <ProductEditView /> },
        { path: 'view/:id', element: <ProductView /> },
  
      ],
    },
    {
      path: 'vendors',
      element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
      children: [
        { element: <VendorPage />, index: true },
        { path: 'edit/:id', element: <VendorEditView /> },
        { path: 'view/:id', element: <VendorView /> },
  
      ],
    },
  
    {
      path: 'orders',
      element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
      children: [
        { element: <OrderPage />, index: true },
        { path: 'details/:id', element: <OrderDetailsView /> },
  
      ],
    },

    {
        path: 'accounts',
        element: CONFIG.auth.skip ? <> {layoutContent} </> : <AuthGuard> {layoutContent} </AuthGuard>,
        children: [
          { element: <LedgerPage />, index: true },
          { path: 'ledger', element: <LedgerPage /> },
          { path: 'receivable', element: <ReceivablesPage /> },
          { path: 'view/:id', element: <ReceivablesListDetails /> },
          { path: 'ledger/view/:id', element: <LedgerListDetails /> },
        ],
      },
  
    {
      path: 'stocks',
      element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
      children: [
        { element: <StockPage />, index: true }
      ],
    },
  
    {
        path: 'logs',
        element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
        children: [
          { element: <LogPage />, index: true },
        ],
      },
  
    {
      path: 'settings',
      element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
      children: [
        { element: <FAQPage />, index: true },
        { path: 'faq', element: <FAQPage /> },
        { path: 'faq/create', element: <FAQCreateView /> },
        { path: 'faq/edit/:id', element: <FAQEditView /> },
        { path: 'faq/view/:id', element: <FAQView /> },
        { path: 'contact-us', element: <ContactPage /> },
        // { path: 'privacy-policy', element: <PrivacyPage /> },
        { path: 'terms-conditions', element: <TermsPage /> },
        { path: 'profile-settings', element: <ProfilePage /> },
        { path: 'banner', element: <BannerPage /> },
        { path: 'banner/create', element: <BannerCreateView /> },
        { path: 'banner/edit/:id', element: <BannerEditView /> },
        { path: 'banner/view/:id', element: <BannerView /> },
        { path: 'sync', element: <SyncPage /> },
        { path: 'tally', element: <TallyPage /> },


      ],
    },

    {
      path: 'payments',
      element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
      children: [
        {  element: <PaymentPage />, index: true }, // Default route for "/payment"
        { path: 'create', element: <PaymentCreateView/> },
        { path: 'edit/:id', element: <PaymentEditView/> },
        { path: 'view', element: <PaymentViewUi/> },

      ],
    },
    
  
    {
      path: 'logout',
      element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
      children: [
        { element: <LogoutPage />, index: true },
      ],
    },
  
    { path: '500', element: <Page500 /> },
    { path: '404', element: <Page404 /> },
    { path: '403', element: <Page403 /> },
  ];
  