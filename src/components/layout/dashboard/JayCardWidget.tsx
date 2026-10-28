import { useMemo } from "react";
import { useWeather, buildForecast } from "@/hooks/useWeather";
import type { WeatherLocation } from "@/lib/weather/types";
import { getWeatherEmoji } from "@/lib/weather/openMeteo";
import { Emoji } from "@/components/shared/Emoji";
import { DASHBOARD_WIDGET_FONT } from "./dashboardWidgetConstants";

const SF: WeatherLocation = { kind: "coords", lat: 37.7749, lon: -122.4194 };

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jay-pham/" },
  { label: "Instagram", href: "https://www.instagram.com/j.pham25" },
  { label: "Email", href: "mailto:jay.pham25@gmail.com" },
  { label: "GitHub", href: "https://github.com/Jpham111" },
];

function PixelBridge() {
  const P = "#dc2626";
  const L = "#f87171";
  const D = "#b91c1c";
  return (
    <svg
      viewBox="0 0 48 28"
      style={{ width: "100%", display: "block", imageRendering: "pixelated" }}
      shapeRendering="crispEdges"
    >
      {/* Water */}
      <rect x="4" y="21" width="40" height="7" rx="3" fill="#0d7377" />
      <rect x="8" y="22" width="3" height="1" fill="#14b8a6" opacity="0.6" />
      <rect x="20" y="23" width="4" height="1" fill="#14b8a6" opacity="0.5" />
      <rect x="34" y="22" width="3" height="1" fill="#14b8a6" opacity="0.6" />
      <rect x="14" y="25" width="2" height="1" fill="#14b8a6" opacity="0.4" />
      <rect x="28" y="24" width="3" height="1" fill="#14b8a6" opacity="0.3" />

      {/* Deck */}
      <rect x="2" y="19" width="44" height="2" fill={P} />

      {/* Left tower — alternating red/light red stripes */}
      <rect x="10" y="3" width="1" height="18" fill={P} />
      <rect x="11" y="3" width="1" height="18" fill={L} />
      <rect x="12" y="3" width="1" height="18" fill={P} />
      <rect x="13" y="3" width="1" height="18" fill={L} />
      <rect x="14" y="3" width="1" height="18" fill={P} />
      <rect x="15" y="3" width="1" height="18" fill={L} />
      <rect x="16" y="3" width="1" height="18" fill={P} />
      {/* Left tower cap */}
      <rect x="10" y="2" width="7" height="2" fill="#ef4444" />

      {/* Right tower — alternating red/light red stripes */}
      <rect x="31" y="3" width="1" height="18" fill={P} />
      <rect x="32" y="3" width="1" height="18" fill={L} />
      <rect x="33" y="3" width="1" height="18" fill={P} />
      <rect x="34" y="3" width="1" height="18" fill={L} />
      <rect x="35" y="3" width="1" height="18" fill={P} />
      <rect x="36" y="3" width="1" height="18" fill={L} />
      <rect x="37" y="3" width="1" height="18" fill={P} />
      {/* Right tower cap */}
      <rect x="31" y="2" width="7" height="2" fill="#ef4444" />

      {/* Left outer cables — stepped catenary */}
      <rect x="9" y="5" width="1" height="1" fill={P} />
      <rect x="8" y="6" width="1" height="1" fill={P} />
      <rect x="7" y="7" width="1" height="2" fill={P} />
      <rect x="6" y="9" width="1" height="2" fill={P} />
      <rect x="5" y="11" width="1" height="2" fill={P} />
      <rect x="4" y="13" width="1" height="3" fill={P} />
      <rect x="3" y="16" width="1" height="3" fill={P} />

      {/* Center cables left half */}
      <rect x="17" y="5" width="1" height="1" fill={P} />
      <rect x="18" y="6" width="1" height="1" fill={P} />
      <rect x="19" y="7" width="1" height="2" fill={P} />
      <rect x="20" y="9" width="1" height="2" fill={P} />
      <rect x="21" y="11" width="1" height="2" fill={P} />
      <rect x="22" y="13" width="1" height="3" fill={P} />
      <rect x="23" y="16" width="1" height="3" fill={P} />

      {/* Center cables right half */}
      <rect x="30" y="5" width="1" height="1" fill={P} />
      <rect x="29" y="6" width="1" height="1" fill={P} />
      <rect x="28" y="7" width="1" height="2" fill={P} />
      <rect x="27" y="9" width="1" height="2" fill={P} />
      <rect x="26" y="11" width="1" height="2" fill={P} />
      <rect x="25" y="13" width="1" height="3" fill={P} />
      <rect x="24" y="16" width="1" height="3" fill={P} />

      {/* Right outer cables — stepped catenary */}
      <rect x="38" y="5" width="1" height="1" fill={P} />
      <rect x="39" y="6" width="1" height="1" fill={P} />
      <rect x="40" y="7" width="1" height="2" fill={P} />
      <rect x="41" y="9" width="1" height="2" fill={P} />
      <rect x="42" y="11" width="1" height="2" fill={P} />
      <rect x="43" y="13" width="1" height="3" fill={P} />
      <rect x="44" y="16" width="1" height="3" fill={P} />

      {/* Tower bases below deck */}
      <rect x="12" y="21" width="3" height="3" fill={D} />
      <rect x="33" y="21" width="3" height="3" fill={D} />
    </svg>
  );
}

function safeEmoji(code: number, isDay?: boolean): string {
  return getWeatherEmoji(code, isDay) || "☀️";
}

interface JayCardWidgetProps {
  widgetId: string;
}

export function JayCardWidget({ widgetId: _widgetId }: JayCardWidgetProps) {
  const { snapshot } = useWeather(SF, { active: true, locale: "en" });

  const forecast = useMemo(
    () =>
      snapshot?.daily ? buildForecast(snapshot.daily, "en").slice(0, 3) : [],
    [snapshot]
  );

  const temp = snapshot?.temperature ?? "--";
  const weatherCode = snapshot?.weatherCode ?? 0;
  const isDay = snapshot?.isDay ?? true;
  const hi = snapshot ? Math.round(snapshot.daily.tempMax[0] ?? 0) : "--";
  const lo = snapshot ? Math.round(snapshot.daily.tempMin[0] ?? 0) : "--";

  return (
    <div
      style={{
        fontFamily: DASHBOARD_WIDGET_FONT,
        color: "#e0e0e0",
        padding: "14px 16px 12px",
        fontSize: 12,
        lineHeight: 1.4,
        userSelect: "none",
      }}
    >
      {/* Pixel art Golden Gate Bridge */}
      <div style={{ margin: "0 0 8px", padding: "0 8px" }}>
        <PixelBridge />
      </div>

      {/* Weather row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
          padding: "6px 8px",
          borderRadius: 8,
          background: "rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Emoji emoji={safeEmoji(weatherCode, isDay)} size={20} />
          <span style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>
            {temp}°
          </span>
          <span style={{ fontSize: 11, opacity: 0.6 }}>San Francisco</span>
        </div>
        <div style={{ fontSize: 11, opacity: 0.5 }}>
          H:{hi}° L:{lo}°
        </div>
      </div>

      {/* 3-day forecast */}
      {forecast.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: 10,
            padding: "4px 0",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {forecast.map((day, i) => (
            <div
              key={`${day.dayLabel}-${i}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                fontSize: 10,
              }}
            >
              <span style={{ opacity: 0.5 }}>{day.dayLabel}</span>
              <Emoji emoji={safeEmoji(day.weatherCode)} size={14} />
              <span style={{ opacity: 0.7 }}>{day.tempHigh}°</span>
            </div>
          ))}
        </div>
      )}

      {/* About */}
      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 2,
          }}
        >
          Jay Pham
        </div>
        <div style={{ fontSize: 11, opacity: 0.5, lineHeight: 1.5 }}>
          Developer & Designer — SF Bay Area
        </div>
      </div>

      {/* Social links */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 10,
              color: "#8ab4ff",
              textDecoration: "none",
              padding: "3px 8px",
              borderRadius: 6,
              background: "rgba(138,180,255,0.1)",
              border: "1px solid rgba(138,180,255,0.15)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(138,180,255,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(138,180,255,0.1)")
            }
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function JayCardBackPanel({
  onDone: _onDone,
}: {
  widgetId: string;
  onDone?: () => void;
}) {
  return (
    <div
      style={{
        fontFamily: DASHBOARD_WIDGET_FONT,
        color: "#e0e0e0",
        padding: "16px",
        fontSize: 12,
      }}
    >
      <div style={{ opacity: 0.6, lineHeight: 1.6 }}>
        This widget shows live weather for San Francisco and Jay's social links.
        <br />
        <br />
        Built with jayOS — a portfolio inspired by classic Mac OS.
      </div>
    </div>
  );
}
