import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export const getStatusColor = (status = "") => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-800 text-white"
    case "expired":
      return "bg-gray-800 text-white"
    case "working":
      return "bg-blue-800 text-white"
    case "inactive":
      return "bg-slate-800 text-white"
    case "banned":
      return "bg-red-800 text-white"
    case "shadowban":
      return "bg-orange-800 text-white"
    case "limited":
      return "bg-purple-800 text-white"
    case "completed":
      return "bg-amber-800 text-white"
    case "standby":
      return "bg-sky-600 text-white"
    default:
      return "bg-slate-800 text-white"
  }
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  // Convert to degrees, percentage, percentage format
  return [
    Math.round(h * 360),
    Math.round(s * 100),
    Math.round(l * 100),
  ];
}

// Convert HEX to RGB
export function hexToRgb(hex: string): [number, number, number] {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return [r, g, b];
}

// Convert HEX to HSL
export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

// Extract dominant colors from an image
export async function extractDominantColors(imagePath: string): Promise<{
  primary: [number, number, number];
  secondary: [number, number, number];
  accent: [number, number, number];
  dark: [number, number, number];
  light: [number, number, number];
  gradient: {
    from: string;
    to: string;
    value: string;
  };
}> {
  // Use the specified color schema from the issue description
  // Convert hex colors to HSL format
  const primaryHsl = hexToHsl("#FF5A6E"); // Coral Pink
  const secondaryHsl = hexToHsl("#FF8A9A"); // Light Coral
  const accentHsl = hexToHsl("#FF3355"); // Heart Red
  const darkHsl = hexToHsl("#121212"); // Midnight
  const lightHsl = hexToHsl("#FFF8F0"); // Cream

  // Gradient colors
  const gradientFrom = "#FFBAC5";
  const gradientTo = "#FF5A6E";
  const gradientValue = "linear-gradient(135deg, #FFBAC5 0%, #FF5A6E 100%)";

  return {
    primary: primaryHsl,
    secondary: secondaryHsl,
    accent: accentHsl,
    dark: darkHsl,
    light: lightHsl,
    gradient: {
      from: gradientFrom,
      to: gradientTo,
      value: gradientValue
    }
  };
}


export function formatFollowerCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}k`
  return `${(count / 1000000).toFixed(1)}M`
}

export function formatDistanceToNow(timestamp: number): string {
  const now = Date.now() / 1000
  const seconds = now - timestamp

  if (seconds < 60) return "à l'instant"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}j`

  const date = new Date(timestamp * 1000)
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
}
