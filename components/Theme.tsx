import { PaintbrushVertical } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSetAtom } from "jotai";
import { themeAtom } from "@/app/store/atoms/theme";
import { title } from "process";

type ThemeType = {
  primary: string;
  secondary: string;
  background: string;
  backgroundSecondary: string;
  text: string;
  destructive: string;
  title: string;
};
const themesAvailable = [
  {
    background: "#FFF287",
    backgroundSecondary: "#C83F12",
    primary: "#00ff44",
    secondary: "#99a1af",
    text: "#3B060A",
    destructive: "#DC3C22",
    title: "oak",
  },
  {
    background: "#113F67",
    backgroundSecondary: "#63C8FF",
    primary: "#00ff44",
    secondary: "#DBDE38",
    text: "#FEFBC7",
    destructive: "#DC3C22",
    title: "navy",
  },
  {
    background: "#000000",
    backgroundSecondary: "#F0E4D3",
    primary: "#00ff44",
    secondary: "#D9A299",
    text: "#9929EA",
    destructive: "#DC3C22",
    title: "witch",
  },
  {
    background: "#335F3B",
    backgroundSecondary: "#93DA97",
    primary: "#5CFF87",
    secondary: "#772600",
    text: "#E3DE61",
    destructive: "#D22002",
    title: "jungle",
  },
  {
    background: "#2ECCEA",
    backgroundSecondary: "#09568C",
    primary: "#72FE26",
    secondary: "#EE8686",
    text: "#FFFFFF",
    destructive: "#FF4343",
    title: "sky",
  },
  {
    background: "#E7FF1C",
    backgroundSecondary: "#049000",
    primary: "#72FE26",
    secondary: "#EA5B6F",
    text: "#00AD56",
    destructive: "#EA5B6F",
    title: "lime",
  },
];
export default function Theme() {
  const setTheme = useSetAtom(themeAtom);
  function handleThemeChange({
    primary,
    secondary,
    background,
    backgroundSecondary,
    text,
    destructive,
  }: ThemeType) {
    // here we will set the theme
    setTheme({
      primary,
      secondary,
      background,
      backgroundSecondary,
      text,
      destructive,
    });
  }
  return (
    <div className="bg-black/5 h-10 w-screen absolute bottom-0 px-20 flex items-center gap-2 justify-center">
      <Drawer>
        <DrawerTrigger className=" flex items-center gap-2 justify-center cursor-pointer  text-[var(--text)]">
          <PaintbrushVertical />
          <p>Themes</p>
        </DrawerTrigger>
        <DrawerContent className="h-[400px] text-[var(--text)]">
          <DrawerHeader>
            <DrawerTitle className="text-[var(--text)]">Themes</DrawerTitle>
          </DrawerHeader>
          <div className="w-full h-full  flex items-center justify-center gap-10">
            {themesAvailable.map((theme, index) => {
              return (
                <div key={index} className="flex flex-col gap-3 w-fit h-fit">
                  <div
                    className="theme h-10 w-28 rounded-lg outline outline-[var(--backgroundSecondary)] flex overflow-hidden cursor-pointer"
                    onClick={() => handleThemeChange(themesAvailable[index])}
                  >
                    <div
                      className="w-1/3 h-full"
                      style={{ backgroundColor: theme.background }}
                    ></div>
                    <div
                      className="w-1/3 h-full"
                      style={{ backgroundColor: theme.backgroundSecondary }}
                    ></div>
                    <div
                      className="w-1/3 h-full"
                      style={{ backgroundColor: theme.text }}
                    ></div>
                  </div>
                  <p>{theme.title}</p>
                </div>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
