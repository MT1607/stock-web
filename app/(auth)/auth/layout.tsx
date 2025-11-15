import React from 'react';
import '../../globals.css';
import AuthProvider from '../../providers/AuthProvider';

// Đây là layout độc lập, nó bao gồm <html> và <body> để không sử dụng root layout.
export default function AuthLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session?: import('next-auth').Session | null;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 antialiased">
        <AuthProvider session={session}>
          {/* Main content area for Auth Page */}
          <main className="flex h-full items-center justify-center p-6">
            <div className="w-full max-w-md">{children}</div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
