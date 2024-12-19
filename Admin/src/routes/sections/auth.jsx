import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthSplitLayout } from 'src/layouts/auth-split';
import { SplashScreen } from 'src/components/loading-screen';
import { GuestGuard } from 'src/auth/guard';

const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/jwt/sign-in'))
};

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: 'sign-in',
        element: (
          <GuestGuard>
            <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
              <Jwt.SignInPage />
            </AuthSplitLayout>
          </GuestGuard>
        ),
      },
      // Catch-all route for any other path under 'auth'
      {
        path: '*',
        element: <Navigate to="/auth/sign-in" replace />,
      },
    ],
  },
];
