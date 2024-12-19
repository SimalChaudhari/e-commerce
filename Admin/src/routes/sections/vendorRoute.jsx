import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';
import { AuthGuard } from 'src/auth/guard';
import { ItemView } from 'src/sections/vendor-sections/product/view';
import { OrderDetailsView } from 'src/sections/order/view';
import { ReceivablesListDetails } from 'src/sections/accounting/Receivables/view/receivables-details';
import { PaymentViewUi } from 'src/sections/payments/payment-vendor-view';
import { LedgerListDetails } from 'src/sections/accounting/ledger/view/ledger-details';
import {  ProductView } from 'src/sections/product/view';
// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const OrderPage = lazy(() => import('src/pages/orders'));
const LedgerPage = lazy(() => import('src/pages/accounting/ledger'));
const ReceivablesPage = lazy(() => import('src/pages/accounting/Receivables'));
const ProfilePage = lazy(() => import('src/pages/vendor-page/settings/profile'));
const LogoutPage = lazy(() => import('src/pages/settings/logout'));


// Vendor
const ItemPage = lazy(() => import('src/pages/vendor-page/items'));

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

export const vendorRoutes = [
    {
        path: 'dashboard',
        element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
        children: [
            { element: <IndexPage />, index: true },
        ],
    },
    {
        path: 'items',
        element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
        children: [
            { element: <ItemPage />, index: true },
            // { path: 'view/:id', element: <ItemView /> },
            { path: 'checkout', element: <ItemPage /> },
            { path: 'view/:id', element: <ProductView /> },
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
        path: 'settings',
        element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
        children: [
            { path: 'profile-settings', element: <ProfilePage /> },
        ],
    },

    {
        path: 'payments',
        element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
        children: [
            { path: 'view', element: <PaymentViewUi /> },

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
