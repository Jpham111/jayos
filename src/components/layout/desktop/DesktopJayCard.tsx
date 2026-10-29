import { useCallback, useRef, useState } from "react";
import { JayCardContent } from "@/components/layout/dashboard/JayCardWidget";

export function DesktopJayCard() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragging = useRef<{ ox: number; oy: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const currentX = rect.left;
    const currentY = rect.top;
    if (!pos) setPos({ x: currentX, y: currentY });
    dragging.current = { ox: e.clientX - currentX, oy: e.clientY - currentY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPos({ x: e.clientX - dragging.current.ox, y: e.clientY - dragging.current.oy });
  }, []);

  const onPointerUp = useCallback(() => { dragging.current = null; }, []);

  const centered = !pos;

  return (
    <div
      ref={cardRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "absolute",
        ...(centered
          ? { left: "50%", top: "50%", transform: "translate(-50%, -50%)" }
          : { left: pos.x, top: pos.y }),
        width: "min(560px, calc(100vw - 32px))",
        maxHeight: "calc(100vh - 100px)",
        borderRadius: 16,
        background: "rgba(30, 30, 30, 0.75)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        overflowX: "hidden" as const,
        overflowY: "auto" as const,
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
