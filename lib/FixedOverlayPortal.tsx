import { createPortal } from "react-dom";

export function FixedOverlay({ children }: { children: React.ReactNode }) {
    const root = document.getElementById("fixed-overlay-root");
    if (!root) return null;

    return createPortal(
        <div className="fixed-canvas-overlay">
            {children}
        </div>,
        root
    );
}
