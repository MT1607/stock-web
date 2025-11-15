import UserInfo from '@/components/user-info';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <main
      style={{ padding: '20px' }}
      className="flex h-screen flex-col items-center justify-center gap-5"
    >
      <h1>Welcome to the Stock App</h1>
      <Image
        src="/next.svg"
        alt="Next.js Logo"
        width={180}
        height={37}
        priority
      />
      <UserInfo />
    </main>
  );
}
