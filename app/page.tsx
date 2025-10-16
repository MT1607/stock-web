import UserInfo from "@/components/UserInfo";
import Image from "next/image";

export default function Home() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>Welcome to the Next.js App with Keycloak Authentication</h1>
      <Image
        src="/next.svg"
        alt="Next.js Logo"
        width={180}
        height={37}
        priority
      />
      <UserInfo/>
    </main>
  );
}
