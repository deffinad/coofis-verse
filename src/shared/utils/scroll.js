import { useLayoutEffect, useState } from 'react';

// Function to get scrollbar width
export const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth;
};
