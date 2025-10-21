'use client';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const UserInfo = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log('Session data:', session);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'authenticated') {
    router.push('/i-board');
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
