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
    background: "#095292",
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
    background: "#E7FF1C",
    backgroundSecondary: "#049000",
    primary: "#72FE26",
    secondary: "#EA5B6F",
    text: "#00AD56",
    destructive: "#EA5B6F",
    title: "lime",
  },
  {
    background: "#FFFCF6",
    backgroundSecondary: "#DA0202",
    primary: "#72FE26",
    secondary: "#292929",
    text: "#00A0B1",
    destructive: "#EA5B6F",
    title: "arctic",
  },
  {
    background: "#F8B259",
    backgroundSecondary: "#FDF5AA",
    primary: "#FEFFC4",
    secondary: "#9C2801",
    text: "#C75D2C",
    destructive: "#9C2801",
    title: "caramel",
  },
  {
    background: "#2c2e31",
    backgroundSecondary: "#D6AC0E",
    primary: "#00ff44",
    secondary: "#EA5B6F",
    text: "#646669",
    destructive: "#D00723",
    title: "OG",
  },
  {
    background: "#101010",
    backgroundSecondary: "#FFD700",
    primary: "#FFFFFF",
    secondary: "#FF9C5F",
    text: "#D22B2B",
    destructive: "#FBFF5F",
    title: "volcano",
  },
  {
    background: "#2d2d2d",
    backgroundSecondary: "#d7263d",
    primary: "#33E87B",
    secondary: "#F17474",
    text: "#f4a261",
    destructive: "#D00723",
    title: "lazy",
  },
  {
    background: "#8918FF",
    backgroundSecondary: "#EB3DFF",
    primary: "#19FE55",
    secondary: "#FEF319",
    text: "#F7F7F7",
    destructive: "#FE3019",
    title: "flux",
  },
  {
    background: "#242424",
    backgroundSecondary: "#FFFFFF",
    primary: "#FFFFFF",
    secondary: "#3E3636",
    text: "#8C8C8C",
    destructive: "#080808",
    title: "blackboard",
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
          <div className="w-full md:w-3/4 h-full grid grid-cols-2 sm:grid-cols-4 place-self-center items-center gap-5 p-2 sm:gap-10 overflow-y-auto md:overflow-hidden">
            {themesAvailable.map((theme, index) => {
              return (
                <div key={index} className="flex flex-col items-center justify-center gap-3 w-full h-full">
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
