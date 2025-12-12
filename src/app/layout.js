'use client';

import { Roboto } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import CitiesBootstrapper from '@/components/layout/cities-bootstrapper';
import { AuthProvider } from '@/context/auth-context';
import ReduxProvider from '@/libs/redux/redux-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './globals.css';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body
        suppressHydrationWarning
        className={`${roboto.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <ReduxProvider>
            <AuthProvider>
              <Toaster position="top-right" />
              <CitiesBootstrapper />
              <Header />
              <main>{children}</main>
              <Footer />
            </AuthProvider>
          </ReduxProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
