import { useCallback, useRef, useState } from "react";
import { JayCardContent } from "@/components/layout/dashboard/JayCardWidget";

export function DesktopJayCard() {
  const [pos, setPos] = useState({ x: 20, y: -1 });
  const dragging = useRef<{ ox: number; oy: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPos({ x: e.clientX - dragging.current.ox, y: e.clientY - dragging.current.oy });
  }, []);

  const onPointerUp = useCallback(() => { dragging.current = null; }, []);

  const bottom = pos.y === -1 ? 80 : undefined;
  const top = pos.y === -1 ? undefined : pos.y;

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "absolute",
        left: pos.x,
        ...(bottom !== undefined ? { bottom } : { top }),
        width: 560,
        borderRadius: 16,
        background: "rgba(30, 30, 30, 0.75)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        overflow: "hidden",
        zIndex: 1,
        pointerEvents: "auto",
        cursor: dragging.current ? "grabbing" : "grab",
        userSelect: "none",
      }}
    >
      <JayCardContent />
    </div>
  );
}
