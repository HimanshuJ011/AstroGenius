"use client";

import { useEffect } from "react";

const DisableDevTools = () => {
  useEffect(() => {
    const disableContextMenu = (e: MouseEvent) => e.preventDefault();
    const disableShortcuts = (e: KeyboardEvent) => {
      // Prevent specific key combinations
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl + Shift + I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl + Shift + J
        (e.ctrlKey && e.keyCode === 85) || // Ctrl + U
        (e.ctrlKey && e.keyCode === 67) // Ctrl + C
      ) {
        e.preventDefault();
      }
    };

    // Attach event listeners
    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keydown", disableShortcuts);

    return () => {
      // Cleanup event listeners on unmount
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", disableShortcuts);
    };
  }, []);

  return null; // This component does not render anything
};

export default DisableDevTools;
