import { useState, useEffect } from "react";

export const generateRandomId = () => Math.random().toString(36).substr(2, 8);

/**
 * Custom hook to dynamically calculate the height of a menu element.
 * It adjusts the height based on the element's position in the viewport,
 * ensuring it fits correctly during scroll and resize events.
 * @param {React.RefObject} menuRef - A ref attached to the menu element.
 * @returns {string} The calculated height string (e.g., "700px").
 */
export const useDynamicMenuHeight = (menuRef) => {
  const [menuHeight, setMenuHeight] = useState("calc(100vh - 150px)");

  useEffect(() => {
    const calculateHeight = () => {
      if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const topOffset = rect.top;
        const bottomPadding = 20; // Desired padding from the bottom of the viewport
        const availableHeight = viewportHeight - topOffset - bottomPadding;
        const minHeight = 300; // Minimum height for the menu
        const finalHeight = Math.max(availableHeight, minHeight);
        setMenuHeight(`${finalHeight}px`);
      }
    };

    calculateHeight();

    window.addEventListener("scroll", calculateHeight, { passive: true });
    window.addEventListener("resize", calculateHeight);

    return () => {
      window.removeEventListener("scroll", calculateHeight);
      window.removeEventListener("resize", calculateHeight);
    };
  }, [menuRef]);

  return menuHeight;
};
