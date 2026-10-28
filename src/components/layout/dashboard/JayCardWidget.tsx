import { useMemo, useState } from "react";
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

const BRIDGE_TOP = `\
     ^^      ..                                       ..
             []                                       []
           .:[]:_          ^^                       ,:[]:.
         .: :[]: :-.                             ,-: :[]: :.
       .: : :[]: : :\`._                       ,.': : :[]: : :.
     .: : : :[]: : : : :-._               _,-: : : : :[]: : : :.
 _..: : : : :[]: : : : : : :-._________.-: : : : : : :[]: : : : :-._
 _:_:_:_:_:_:[]:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:_:[]:_:_:_:_:_:_
 !!!!!!!!!!!![]!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!![]!!!!!!!!!!!!!
 ^^^^^^^^^^^^[]^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[]^^^^^^^^^^^^^
             []                                       []
             []                                       []
             []                                       []`;

const BRIDGE_WATER = `\
  ~~^-~^_~^~/  \\~^-~^~_~^-~_^~-^~_^~~-^~_~^~-~_~-^~_^/  \\~^-~_~^-~~-
 ~ _~~- ~^-^~-^~~- ^~_^-^~~_ -~^_ -~_-~~^- _~~_~-^_ ~^-^~~-_^-~ ~^
    ~ ^- _~~_-  ~~ _ ~  ^~  - ~~^ _ -  ^~-  ~ _  ~~^  - ~_   - ~^_~
      ~-  ^_  ~^ -  ^~ _ - ~^~ _   _~^~-  _ ~~^ - _ ~ - _ ~~^ -
  .  ~^ -_ ~^^ -_ ~ _ - _ ~^~-  _~ -_   ~- _ ~^ _ -  ~ ^-
             ~^~ - _ ^ - ~~~ _ - _ ~-^ ~ __- ~_ - ~  ~^_-
                 ~ ~- ^~ -  ~^ -  ~ ^~ - ~~  ^~ -`;

function BridgeArt({ light }: { light?: boolean }) {
  const shared: React.CSSProperties = {
    fontFamily: "'SF Mono', 'Menlo', 'Monaco', monospace",
    fontSize: 9.5,
    lineHeight: 1.15,
    textAlign: "left",
    margin: 0,
    overflow: "hidden",
    whiteSpace: "pre",
    transition: "color 0.2s",
  };
  const bridgeColor = light ? "#c44525" : "#e85d3a";
  const waterColor = light ? "#1a6dd4" : "#4a9eed";
  return (
    <div style={{ width: "fit-content", margin: "0 auto" }}>
      <pre style={{ ...shared, color: bridgeColor, textShadow: light ? "none" : "0 0 4px rgba(232,93,58,0.3)" }}>
        {BRIDGE_TOP}
      </pre>
      <pre style={{ ...shared, color: waterColor, textShadow: light ? "none" : "0 0 4px rgba(74,158,237,0.3)" }}>
        {BRIDGE_WATER}
      </pre>
    </div>
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
  const [light, setLight] = useState(false);
  const { snapshot } = useWeather(SF, { active: true, locale: "en" });

  const forecast = useMemo(
    () =>
      snapshot?.daily ? buildForecast(snapshot.daily, "en").slice(0, 3) : [],
    [snapshot]
  );

  const toF = (c: number) => Math.round(c * 9 / 5 + 32);
  const temp = snapshot?.temperature != null ? toF(snapshot.temperature) : "--";
  const weatherCode = snapshot?.weatherCode ?? 0;
  const isDay = snapshot?.isDay ?? true;
  const hi = snapshot ? toF(snapshot.daily.tempMax[0] ?? 0) : "--";
  const lo = snapshot ? toF(snapshot.daily.tempMin[0] ?? 0) : "--";

  const fg = light ? "#1a1a1a" : "#e0e0e0";
  const fgStrong = light ? "#000" : "#fff";
  const muted = light ? 0.6 : 0.5;
  const subtleBg = light ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
  const border = light ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)";
  const linkColor = light ? "#1a6dd4" : "#8ab4ff";
  const linkBg = light ? "rgba(26,109,212,0.1)" : "rgba(138,180,255,0.1)";
  const linkBorder = light ? "rgba(26,109,212,0.2)" : "rgba(138,180,255,0.15)";
  const linkHover = light ? "rgba(26,109,212,0.18)" : "rgba(138,180,255,0.2)";

  return (
    <div
      style={{
        fontFamily: DASHBOARD_WIDGET_FONT,
        color: fg,
        padding: "14px 16px 12px",
        fontSize: 12,
        lineHeight: 1.4,
        userSelect: "none",
        background: light ? "rgba(255,255,255,0.92)" : "transparent",
        borderRadius: "inherit",
        transition: "background 0.2s, color 0.2s",
      }}
    >
      {/* ASCII Golden Gate Bridge */}
      <div style={{ margin: "0 0 8px" }}>
        <BridgeArt light={light} />
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
          background: subtleBg,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Emoji emoji={safeEmoji(weatherCode, isDay)} size={20} />
          <span style={{ fontSize: 18, fontWeight: 600, color: fgStrong }}>
            {temp}°
          </span>
          <span style={{ fontSize: 11, opacity: 0.6 }}>San Francisco</span>
        </div>
        <div style={{ fontSize: 11, opacity: muted }}>
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
            borderTop: `1px solid ${border}`,
            borderBottom: `1px solid ${border}`,
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
              <span style={{ opacity: muted }}>{day.dayLabel}</span>
              <Emoji emoji={safeEmoji(day.weatherCode)} size={14} />
              <span style={{ opacity: 0.7 }}>{toF(day.tempHigh)}°</span>
            </div>
          ))}
        </div>
      )}

      {/* About */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: fgStrong,
              marginBottom: 2,
            }}
          >
            Jay Pham
          </div>
          <button
            onClick={() => setLight((v) => !v)}
            style={{
              background: subtleBg,
              border: `1px solid ${border}`,
              borderRadius: 6,
              padding: "2px 7px",
              fontSize: 10,
              color: fg,
              cursor: "pointer",
              opacity: 0.7,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            title="Toggle light/dark mode (WCAG)"
          >
            {light ? "Dark" : "Light"}
          </button>
        </div>
        <div style={{ fontSize: 11, opacity: muted, lineHeight: 1.5 }}>
          Developer & Designer — SF Bay Area
        </div>
        <div style={{ fontSize: 10, color: fgStrong, opacity: light ? 1 : 0.75, lineHeight: 1.6, marginTop: 6 }}>
          Hi, I'm a product designer with a deep appreciation for systems thinking, clean interfaces, and the small details that create great user experiences. I approach design as both a craft and a system—where every decision has purpose, and every detail has impact. Outside of work I like to be outdoors and go to Music festivals with friends!
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
              color: linkColor,
              textDecoration: "none",
              padding: "3px 8px",
              borderRadius: 6,
              background: linkBg,
              border: `1px solid ${linkBorder}`,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = linkHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = linkBg)
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
