"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Topbar from "@/components/topbar";
import { cookieType, userCookie } from "@/app/store/atoms/userCookie";
import { URI } from "@/lib/URI";
import { TestPayload } from "@/lib/zodSchema";
import axios from "axios";
import { decodeJwt } from "jose";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoadingUserConfig } from "./TypeScreen";
import { animationOnProfileAtom } from "@/app/store/atoms/animationOnProfile";
import HistoryTable from "./historyTable";
import BestStats from "./bestStats";
import LastTenTests from "./LastTenTests";
import PerformaceInTenTests from "./PerformaceInTenTests";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import About from "./About";
import ChangeInLastYearTests from "./ChangeInLastYearTests";
const ZeroValues = {
  mode: "Placeholder",
  mode2: 0,
  accuracy: 0,
  rawWpm: 0,
  avgWpm: 0,
  isPb: false,
  charSets: [0, 0, 0, 0],
};

type cumulativeInterval = {
  wpm: number;
  rawWpm: number;
  interval: number;
  errors: number;
  problematicKeys: string[];
}[];
export type results = {
  charSets: number[];
  mode: string;
  rawWpm: number;
  flameGraph: cumulativeInterval;
  accuracy: number;
  avgWpm: number;
  language: string;
  id: string;
  createdAt: string;
  userId: string;
}[];
export default function ProfilePage({
  sessionCookie,
}: {
  sessionCookie: cookieType;
}) {
  const router = useRouter();
  const [cookie, setCookie] = useAtom(userCookie);
  const [animation, setAnimation] = useAtom(animationOnProfileAtom);
  const [bodyToBeParsed, setBodyToBeParsed] = useState<TestPayload | null>(
    null
  );
  const [completedTestBeforeSignedIn, setCompletedTestBeforeSignIn] =
    useState<boolean>(false);
  //test completed before sign in useEffects
  useEffect(() => {
    const value = localStorage.getItem("token") ? true : false;
    if (!animation) {
      setTimeout(() => {
        setAnimation(true);
      }, 3000);
    }
    setCompletedTestBeforeSignIn(value);
    setCookie(sessionCookie);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setBodyToBeParsed(decodeJwt<TestPayload>(token));
    } catch {
      toast.error("Bad token in localStorage");
    }
  }, []);

  // fetches the initial data

  const {
    mode,
    mode2,
    accuracy,
    rawWpm,
    avgWpm,
    isPb,
    charSets: charArray,
  } = bodyToBeParsed || ZeroValues;
  const charArrayRepresentation =
    charArray[0] +
    " / " +
    charArray[1] +
    " / " +
    charArray[2] +
    " / " +
    charArray[3];
  async function handleClick(state: boolean) {
    setCompletedTestBeforeSignIn(false);
    if (!state) {
      localStorage.removeItem("token");
      return;
    }

    if (accuracy < 36 || !rawWpm || !avgWpm) {
      toast.error("Invalid test!");
      return;
    }
    const body = {
      token: localStorage.getItem("token"),
    };
    try {
      const res = await axios.post(`${URI}/api/saveTempTest`, body);
      toast.success(res.data.msg);
    } catch (error) {
      toast.warning("some fields are missing/tampered");
    }
    localStorage.removeItem("token");
  }
  const accuracyVal = parseFloat(accuracy.toFixed(2));
  const rawWpmVal = parseFloat(rawWpm.toFixed(2));
  const avgWpmVal = parseFloat(avgWpm.toFixed(2));
  async function handleLogout() {
    toast.info("Logging out!");
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
    toast.info("Logged out! >:(");
  }
  return (
    <div className="w-full min-h-screen relative bg-[var(--background)] text-[var(--text)] flex flex-col gap-10 items-center">
      <LoadingUserConfig isMounted={animation} />
      <Topbar />
      <div className="w-full sm:w-4/5 h-fit flex gap-1 justify-end">
        <p className="hover:text-[var(--backgroundSecondary)] hover:cursor-pointer" onClick={handleLogout}>
          Logout
        </p>
        <LogOut />
      </div>
        <About/>
        <Dialog open={completedTestBeforeSignedIn} onOpenChange={setCompletedTestBeforeSignIn}>
          <DialogContent className="w-full sm:w-1/2 text-[var(--text)]">
            <DialogTitle>Last Signed out Test</DialogTitle>
            <DialogDescription>Would you like to save it?</DialogDescription>

            {isPb && <p className="text-xl">New Record!</p>}
            <div className="bg-[var(--backgroundSecondary)] text-[var(--background)] w-full h-20 flex flex-col items-center justify-center gap-3 rounded-xl">
              <p>Test type</p>
              <p>
                {mode} {mode2}
              </p>
            </div>
            <div className=" w-full h-20 flex items-center justify-around">
              <div>
                <p>{rawWpmVal}</p>
                <p>Raw Wpm</p>
              </div>
              <div>
                <p>{avgWpmVal}</p>
                <p>Avg Wpm</p>
              </div>
            </div>
            <div className=" w-full h-20 flex items-center justify-around">
              <div>
                <p>{accuracyVal + "%"}</p>
                <p>Accuracy</p>
              </div>
              <div>
                <p>{charArrayRepresentation}</p>
                <p>Characters</p>
              </div>
            </div>
            <div className="flex justify-around text-[var(--background)] items-center h-fit mt-3">
              <button
                className="h-12 w-2/5 flex items-center justify-center bg-[var(--destructive)]/80 hover:bg-[var(--background)] hover:text-[var(--text)] hover:outline hover:outline-[var(--destructive)] rounded-lg cursor-pointer"
                onClick={() => handleClick(false)}
              >
                Discard
              </button>
              <button
                className="h-12 w-2/5 flex items-center justify-center bg-[var(--backgroundSecondary)] hover:text-[var(--backgroundSecondary)] hover:bg-[var(--background)] hover:outline hover:outline-[var(--backgroundSecondary)] rounded-lg cursor-pointer"
                onClick={() => handleClick(true)}
              >
                Save
              </button>
            </div>
          </DialogContent>
        </Dialog>
      

      <BestStats />
      <ChangeInLastYearTests />
      <LastTenTests />
      <PerformaceInTenTests />
      <HistoryTable />
    </div>
  );
}
