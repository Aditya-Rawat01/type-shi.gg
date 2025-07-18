import { userCookie } from "@/app/store/atoms/userCookie";
import { useAtomValue } from "jotai";
import { memo } from "react";
import GithubFlameGraph from "./GithubFlameGraph";

const About = memo(() => {
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
  return (<div className="w-full sm:w-4/5 flex flex-col items-end">
    
    <p>{account}</p>
    <p>Joined on: 12 may 2025</p>
    <GithubFlameGraph/>
    </div>
    )
});

export default About;
