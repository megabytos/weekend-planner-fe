'use client';

import { Roboto } from 'next/font/google';

import ReduxProvider from '@/libs/redux-provider';
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
          <ReduxProvider>{children}</ReduxProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
