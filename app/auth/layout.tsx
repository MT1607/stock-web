import AuthProvider from '../providers/AuthProvider';

export default function AuthLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session?: import('next-auth').Session | null;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
