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

const BRIDGE_ASCII = `\
   ^^                                                 .:
        []                    ^^                  []
      .:[]:_                                   ,;[]:.
    .:  :[]:  :-.                          ,-:  :[]: :.
   .:  :  :[]:  :  \`.                  ,.'  :  :[]:  : :.
  .:  :  :  :[]:  :  ::-._        _,-::  :  :  :[]:  :  ::.
 _.:  :  :  :[]:  :  :  ::-.____.-::  :  :  :  :[]:  :  :  :._
 _:_:_:_:_:_:[]:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:[]:_:_:_:_:_:_
 !!!!!!!!!!!!!![]!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!![]!!!!!!!!!!!!!!
 ^^^^^^^^^^^^^^[]^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[]^^^^^^^^^^^^^^
               []                                  []
               []                                  []
               []                                  []

 ~~^~^^_~^/    \\~^~^^~_~^~_~~^~_~~~^~~^~~^^~_~/    \\~^~_~^^~~
 ~ _~~-~^^_~^_~~-^^~_^~^^~__~^ _~-_~~^__~~_~_~^~^^~^_~^-~~^
   ~ ^-_-~~_-~~ _~ ^~ -~^^~ -_ ^^~- ~~~^  -_ -~^_~
     ~-  ^   ~ - ^^  -~^^~    ~~-   ~~^  ~-  ~~_-`;

function BridgeArt() {
  return (
    <pre
      style={{
        fontFamily: "'SF Mono', 'Menlo', 'Monaco', monospace",
        fontSize: 5.2,
        lineHeight: 1.15,
        color: "#e85d3a",
        textAlign: "center",
        margin: 0,
        overflow: "hidden",
        textShadow: "0 0 4px rgba(232,93,58,0.3)",
        whiteSpace: "pre",
      }}
    >
      {BRIDGE_ASCII}
    </pre>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */
function safeEmoji(code: number, isDay?: boolean): string {
  return getWeatherEmoji(code, isDay) || "☀️";
}

/* ------------------------------------------------------------------ */
/*  JayCard content (used by both Desktop card & Dashboard widget)     */
/* ------------------------------------------------------------------ */
export function JayCardContent() {
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
      {/* ASCII Golden Gate Bridge */}
      <div style={{ margin: "0 0 8px" }}>
        <BridgeArt />
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

/* ------------------------------------------------------------------ */
/*  Dashboard widget wrappers                                          */
/* ------------------------------------------------------------------ */
interface JayCardWidgetProps {
  widgetId: string;
}

export function JayCardWidget({ widgetId: _widgetId }: JayCardWidgetProps) {
  return <JayCardContent />;
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
