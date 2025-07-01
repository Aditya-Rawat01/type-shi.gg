"use client";
import { userCookie } from "@/app/store/atoms/userCookie";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
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
  async function handleLogout() {
      
    toast.info("Logging out!")
    await authClient.signOut({
        fetchOptions: {
            onSuccess: ()=> {
                router.push("/");
            }
        }
    })
    toast.info("Logged out! >:(")
  }
  return (
    <div className="w-full h-20 flex items-center justify-between px-20 py-3 bg-fuchsia-400 text-white">
      <p className="cursor-pointer p-1" onClick={()=>router.push("/")}>typeshi.gg</p>
      {!cookie ? (
        <p
          className="underline cursor-pointer"
          onClick={() => router.push("/login")}
        >
          {account}
        </p>
      ) : (
        <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="cursor-pointer">{account}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>typeshi.gg</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={()=>router.push("/me")}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      )}
    </div>
  );
}
