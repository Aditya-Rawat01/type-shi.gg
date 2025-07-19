// In a file like app/themes.ts (or wherever you want to keep this logic)
import { themesAvailable, ThemeType } from "./availableThemes";

// This function generates the script string
export function getInitialThemeScript() {
  const themeSetterFn = (allThemes: ThemeType[]) => {
    // This function will be stringified and executed on the client
    let themeFound: ThemeType;
    const storedThemeJSON = localStorage.getItem("themeConfigs");
    if (storedThemeJSON) {
      themeFound = JSON.parse(storedThemeJSON);
    } else {
      themeFound = allThemes[0]; // Default for new visitors
    }

    const theme = themeFound;

    const css = `:root {
      --background: ${theme.background};
      --text: ${theme.text};
      --primary: ${theme.primary};
      --secondary: ${theme.secondary};
      --backgroundSecondary:${theme.backgroundSecondary};
      --destructive:${theme.destructive};
    }`;

    // Use an ID so React can find and potentially manage this tag later if needed
    const style = document.createElement("style");
    style.id = "initial-theme-styles";
    style.innerHTML = css;
    document.head.appendChild(style);
  };

  // Return the script tag content
  return `(${String(themeSetterFn)})(${JSON.stringify(themesAvailable)});`;
}
