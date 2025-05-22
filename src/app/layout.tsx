import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Using Geist Sans as primary
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// Geist Mono can be removed if not specifically needed for code display,
// but keeping it as it's part of the default scaffold.
const geistMono = Geist({ // Assuming Geist can be used for mono as well, or import Geist_Mono
  variable: '--font-geist-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Example weights
});


export const metadata: Metadata = {
  title: 'AIAssist',
  description: 'Enhance your chat experience with AI-powered document integration.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
