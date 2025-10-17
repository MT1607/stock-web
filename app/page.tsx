import UserInfo from '@/components/user-info';
import Image from 'next/image';

export default function Home() {
  return (
    <main
      style={{ padding: '20px' }}
      className="flex h-screen flex-col items-center justify-center gap-5"
    >
      <h1>Welcome to the Fake Stock App created by Next.js</h1>
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
