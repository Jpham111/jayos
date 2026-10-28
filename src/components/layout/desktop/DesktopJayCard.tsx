import { JayCardContent } from "@/components/layout/dashboard/JayCardWidget";

export function DesktopJayCard() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 20,
        width: 300,
        borderRadius: 16,
        background: "rgba(30, 30, 30, 0.75)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        overflow: "hidden",
        zIndex: 1,
        pointerEvents: "auto",
      }}
    >
      <JayCardContent />
    </div>
  );
}
