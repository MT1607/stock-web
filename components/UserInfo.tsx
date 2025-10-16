"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserInfo = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    router.push("/dashboard");
  }

  return (
    <div className="p-6 text-center">
      <button
        onClick={() => signIn("keycloak")}
        className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign In with Keycloak
      </button>
    </div>
  );
};

export default UserInfo;
