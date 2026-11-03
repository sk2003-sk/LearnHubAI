import { useEffect } from "react";

export default function useClickOutside(ref, onOutside, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    const handlePointerDown = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      onOutside?.(event);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [ref, onOutside, enabled]);
}
