import { useState, useEffect } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<ToasterProps["theme"]>("light");

  // Example: detect system preference
  useEffect(() => {
    const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setTheme(darkMedia.matches ? "dark" : "light");
    darkMedia.addEventListener("change", updateTheme);
    updateTheme();

    return () => darkMedia.removeEventListener("change", updateTheme);
  }, []);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
