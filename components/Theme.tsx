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

type ThemeType = {
  primary: string;
  secondary: string;
  background: string;
  backgroundSecondary: string;
  text: string;
  destructive: string;
};
const themesAvailable = [
  {
    background: "#FFF287",
    backgroundSecondary: "#C83F12",
    primary: "#00ff44",
    secondary: "#99a1af",
    text: "#3B060A",
    destructive: "#DC3C22",
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
            <div className="flex flex-col gap-3 w-fit h-fit">
              <div
                className="theme h-10 w-28 rounded-lg outline outline-[var(--backgroundSecondary)] flex overflow-hidden cursor-pointer"
                onClick={() => handleThemeChange(themesAvailable[0])}
              >
                <div className="w-1/3 h-full bg-[#FFF287]"></div>
                <div className="w-1/3 h-full bg-[#C83F12]"></div>
                <div className="w-1/3 h-full bg-[#3B060A]"></div>
              </div>
              <p>Oak</p>
            </div>
           
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
