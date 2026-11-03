import { useState } from "react";
import { cn } from "../../utils/cn";

function Tooltip({ children, content, position = "top", className }) {
  const [visible, setVisible] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}

      {visible && content && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 w-max max-w-56 rounded-lg bg-brand-strong px-3 py-2 text-xs text-brand-strong-foreground shadow-lg",
            positions[position] || positions.top,
            className,
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
