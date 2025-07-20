"use client";
import { userCookie } from "@/app/store/atoms/userCookie";
import { useAtomValue } from "jotai";
import { UserRound } from "lucide-react";
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
    <div className="w-full h-20 sm:h-28 flex justify-between items-center px-3 sm:px-20 py-3 text-[var(--backgroundSecondary)] relative">
      <p className="cursor-pointer p-1 text-3xl sm:text-4xl" onClick={()=>router.push("/")}>type-shi.gg</p>
      {!cookie ? (
        <p
          className="underline cursor-pointer"
          onClick={() => router.push("/login")}
        >
          {account}
        </p>
      ) : (
        <>
        <div className="cursor-pointer hidden sm:block" onClick={()=>router.push("/me")}>{account}</div>
        <div className="cursor-pointer block sm:hidden" onClick={()=>router.push("/me")}><UserRound/></div> 
        </>
      )}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--text)]"></div>
    </div>
  );
}
