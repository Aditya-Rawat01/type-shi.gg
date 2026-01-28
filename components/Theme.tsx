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
import { themesAvailable, ThemeType } from "@/lib/availableThemes";


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
        <DrawerContent className="h-[500px] text-[var(--text)]">
          <DrawerHeader>
            <DrawerTitle className="text-[var(--text)]">Themes</DrawerTitle>
          </DrawerHeader>
          <div className="w-full md:w-3/4 h-full grid grid-cols-2 sm:grid-cols-4 place-self-center items-center gap-5 p-2 sm:gap-10 overflow-y-auto md:overflow-hidden">
            {themesAvailable.map((theme, index) => {
              return (
                <div key={index} className="flex flex-col items-center justify-center gap-3 w-full h-full">
                  <div
                    className="theme h-10 w-28 rounded-lg border border-[var(--backgroundSecondary)] flex overflow-hidden cursor-pointer"
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
