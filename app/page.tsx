import UserInfo from "@/components/UserInfo";
import Image from "next/image";

export default function Home() {
  return (
    <main
      style={{ padding: "20px" }}
      className="flex items-center flex-col gap-5 justify-center h-screen">
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
