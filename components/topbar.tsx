"use client";
import { userCookie } from "@/app/store/atoms/userCookie";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();
  const cookie = useAtomValue(userCookie);
  let account = "";
  if (!cookie) {
    account = "Sign up/in";
  } else if (cookie?.user.name) {
    account = cookie?.user.name;
  } else if (cookie?.user.email) {
    account = cookie?.user.name;
  } else {
    account = "placeholder";
  }
  
  return (
    <div className="w-full h-28 flex items-center justify-between sm:px-20 py-3 bg-[var(--backgroundSecondary)] text-[var(--background)]">
      <p className="cursor-pointer p-1 text-4xl" onClick={()=>router.push("/")}>type-shi.gg</p>
      {!cookie ? (
        <p
          className="underline cursor-pointer"
          onClick={() => router.push("/login")}
        >
          {account}
        </p>
      ) : (
        <div className="cursor-pointer" onClick={()=>router.push("/me")}>{account}</div> 
      )}
    </div>
  );
}
