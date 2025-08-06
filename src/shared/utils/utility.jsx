import { useState, useEffect } from "react";

export const generateRandomId = () => Math.random().toString(36).substr(2, 8);

export const useDynamicMenuHeight = (menuRef) => {
  const [menuHeight, setMenuHeight] = useState("calc(100vh - 150px)");

  useEffect(() => {
    const calculateHeight = () => {
      if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const topOffset = rect.top;
        const bottomPadding = 20;
        const availableHeight = viewportHeight - topOffset - bottomPadding;
        const minHeight = 300;
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
