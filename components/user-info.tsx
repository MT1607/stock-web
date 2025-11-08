'use client';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const UserInfo = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log('Session data:', session);
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/stocks');
    }
  }, [router, status]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 text-center">
      <button
        onClick={() => signIn('keycloak')}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Sign In with Keycloak
      </button>
    </div>
  );
};

export default UserInfo;
