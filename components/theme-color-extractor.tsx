"use client";

import {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import {extractDominantColors} from "@/lib/utils";

export function ThemeColorExtractor() {
  const [isLoaded, setIsLoaded] = useState(false);
  const {theme, resolvedTheme} = useTheme();

  useEffect(() => {
    const applyThemeColors = async () => {
      try {
        // Extract colors from the color schema
        const colors = await extractDominantColors("");

        // Apply the extracted colors to CSS variables
        const root = document.documentElement;

        // Apply primary color (Coral Pink)
        root.style.setProperty("--primary", `${colors.primary[0]} ${colors.primary[1]}% ${colors.primary[2]}%`);
        root.style.setProperty("--primary-foreground", "0 0% 100%"); // White for contrast

        // Apply secondary color (Light Coral)
        root.style.setProperty("--secondary", `${colors.secondary[0]} ${colors.secondary[1]}% ${colors.secondary[2]}%`);
        root.style.setProperty("--secondary-foreground", `${colors.dark[0]} ${colors.dark[1]}% ${colors.dark[2]}%`); // Dark for contrast

        // Apply accent color (Heart Red)
        root.style.setProperty("--accent", `${colors.accent[0]} ${colors.accent[1]}% ${colors.accent[2]}%`);
        root.style.setProperty("--accent-foreground", "0 0% 100%"); // White for contrast

        // Apply background and foreground
        root.style.setProperty("--background", `${colors.light[0]} ${colors.light[1]}% ${colors.light[2]}%`); // Light cream
        root.style.setProperty("--foreground", `${colors.dark[0]} ${colors.dark[1]}% ${colors.dark[2]}%`); // Dark

        // Apply card colors
        root.style.setProperty("--card", `${colors.light[0]} ${colors.light[1]}% ${colors.light[2]}%`); // Light cream
        root.style.setProperty("--card-foreground", `${colors.dark[0]} ${colors.dark[1]}% ${colors.dark[2]}%`); // Dark

        // Apply popover colors
        root.style.setProperty("--popover", `${colors.light[0]} ${colors.light[1]}% ${colors.light[2]}%`); // Light cream
        root.style.setProperty("--popover-foreground", `${colors.dark[0]} ${colors.dark[1]}% ${colors.dark[2]}%`); // Dark

        // Apply muted color (slightly desaturated version of secondary)
        root.style.setProperty("--muted", `${colors.secondary[0]} ${Math.max(10, colors.secondary[1] - 30)}% ${Math.max(85, colors.secondary[2])}%`);
        root.style.setProperty("--muted-foreground", `${colors.dark[0]} ${colors.dark[1]}% ${Math.min(30, colors.dark[2] + 20)}%`);

        // Apply border color (lighter version of primary)
        root.style.setProperty("--border", `${colors.primary[0]} ${Math.max(10, colors.primary[1] - 20)}% ${Math.min(95, colors.primary[2] + 30)}%`);

        // Apply input color (same as border)
        root.style.setProperty("--input", `${colors.primary[0]} ${Math.max(10, colors.primary[1] - 20)}% ${Math.min(95, colors.primary[2] + 30)}%`);

        // Apply ring color (same as primary)
        root.style.setProperty("--ring", `${colors.primary[0]} ${colors.primary[1]}% ${colors.primary[2]}%`);

        // Apply destructive color
        root.style.setProperty("--destructive", `${colors.accent[0]} ${colors.accent[1]}% ${Math.max(30, colors.accent[2] - 10)}%`);
        root.style.setProperty("--destructive-foreground", "0 0% 100%"); // White for contrast

        // Apply gradient color
        root.style.setProperty("--gradient-from", colors.gradient.from);
        root.style.setProperty("--gradient-to", colors.gradient.to);
        root.style.setProperty("--gradient", colors.gradient.value);

        // Also apply to dark mode with adjusted colors
        if (resolvedTheme === 'dark') {
          // For dark mode, we use the dark color as background and light color as foreground
          root.style.setProperty("--background", `${colors.dark[0]} ${colors.dark[1]}% ${colors.dark[2]}%`); // Dark
          root.style.setProperty("--foreground", `${colors.light[0]} ${colors.light[1]}% ${colors.light[2]}%`); // Light cream

          // Apply card colors for dark mode
          root.style.setProperty("--card", `${colors.dark[0]} ${colors.dark[1]}% ${Math.min(15, colors.dark[2] + 5)}%`); // Slightly lighter dark
          root.style.setProperty("--card-foreground", `${colors.light[0]} ${colors.light[1]}% ${colors.light[2]}%`); // Light cream

          // Apply popover colors for dark mode
          root.style.setProperty("--popover", `${colors.dark[0]} ${colors.dark[1]}% ${Math.min(15, colors.dark[2] + 5)}%`); // Slightly lighter dark
          root.style.setProperty("--popover-foreground", `${colors.light[0]} ${colors.light[1]}% ${colors.light[2]}%`); // Light cream

          // Adjust primary, secondary, and accent for dark mode
          root.style.setProperty("--primary", `${colors.primary[0]} ${colors.primary[1]}% ${Math.max(50, colors.primary[2])}%`);
          root.style.setProperty("--secondary", `${colors.secondary[0]} ${colors.secondary[1]}% ${Math.max(40, colors.secondary[2])}%`);
          root.style.setProperty("--accent", `${colors.accent[0]} ${colors.accent[1]}% ${Math.max(40, colors.accent[2])}%`);

          // Adjust muted for dark mode
          root.style.setProperty("--muted", `${colors.dark[0]} ${colors.dark[1]}% ${Math.min(25, colors.dark[2] + 15)}%`);
          root.style.setProperty("--muted-foreground", `${colors.light[0]} ${Math.max(10, colors.light[1] - 20)}% ${Math.max(70, colors.light[2] - 20)}%`);

          // Adjust border for dark mode
          root.style.setProperty("--border", `${colors.dark[0]} ${colors.dark[1]}% ${Math.min(30, colors.dark[2] + 20)}%`);

          // Adjust input for dark mode
          root.style.setProperty("--input", `${colors.dark[0]} ${colors.dark[1]}% ${Math.min(30, colors.dark[2] + 20)}%`);
        }

        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to apply theme colors:", error);
      }
    };

    applyThemeColors();
  }, [resolvedTheme]);

  // This component doesn't render anything visible
  return null;
}
