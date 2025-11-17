'use client';

import { Roboto } from 'next/font/google';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
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
      <body className={`${roboto.variable} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider>
            <AuthProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </AuthProvider>
          </ReduxProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
