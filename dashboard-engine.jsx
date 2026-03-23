import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Treemap,
} from "recharts";

// ============================================================
// UNIVERSAL DASHBOARD ENGINE
// JSON Schema → React Rendering Framework
// ============================================================
// Supported widget types:
//   kpi, line, bar, area, pie, radar, scatter, composed,
//   treemap, table, candlestick, heatmap, markdown, json, gauge
// ============================================================

// --- THEME ---
const THEME = {
  bg: "#0B0F1A",
  surface: "#131825",
  surfaceHover: "#1A2035",
  border: "#1E2640",
  text: "#E2E8F0",
  textDim: "#64748B",
  accent: "#6366F1",
  accentAlt: "#22D3EE",
  positive: "#34D399",
  negative: "#F87171",
  warn: "#FBBF24",
  colors: [
    "#6366F1",
    "#22D3EE",
    "#34D399",
    "#FBBF24",
    "#F87171",
    "#A78BFA",
    "#FB923C",
    "#2DD4BF",
    "#E879F9",
    "#38BDF8",
  ],
  font: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  fontSans: "'DM Sans', 'Segoe UI', sans-serif",
};

// --- SAMPLE DASHBOARD JSON (self-documenting schema) ---
const SAMPLE_DASHBOARD = {
  meta: {
    title: "Stock Market Daily Digest",
    description: "Auto-generated dashboard from Python/LLM pipeline",
    generated_at: "2026-03-23T08:00:00Z",
    version: "1.0",
  },
  layout: { columns: 12, gap: 16 },
  widgets: [
    {
      id: "kpi-row",
      type: "kpi",
      title: "Market Overview",
      span: { cols: 12 },
      data: {
        items: [
          {
            label: "S&P 500",
            value: 5892.41,
            change: 1.23,
            prefix: "",
            suffix: "",
            format: "number",
          },
          { label: "NASDAQ", value: 18734.12, change: -0.45, format: "number" },
          { label: "VIX", value: 14.32, change: -5.2, format: "number" },
          {
            label: "BTC/USD",
            value: 97841,
            change: 3.1,
            prefix: "$",
            format: "number",
          },
          {
            label: "US 10Y",
            value: 4.28,
            change: 0.02,
            suffix: "%",
            format: "number",
          },
          {
            label: "Fear & Greed",
            value: 72,
            format: "number",
            badge: "Greed",
          },
        ],
      },
    },
    {
      id: "price-chart",
      type: "line",
      title: "GOOGL Price (30D)",
      span: { cols: 8 },
      config: {
        xKey: "date",
        yKeys: ["close"],
        smooth: true,
        dot: false,
        areaFill: true,
      },
      data: {
        series: Array.from({ length: 30 }, (_, i) => ({
          date: `03/${String(i + 1).padStart(2, "0")}`,
          close: +(
            178 +
            Math.sin(i / 4) * 8 +
            i * 0.3 +
            Math.random() * 3
          ).toFixed(2),
        })),
      },
    },
    {
      id: "sector-pie",
      type: "pie",
      title: "Portfolio Allocation",
      span: { cols: 4 },
      config: { nameKey: "sector", valueKey: "weight", donut: true },
      data: {
        series: [
          { sector: "AI Software", weight: 28 },
          { sector: "Mag7", weight: 25 },
          { sector: "Semiconductor", weight: 20 },
          { sector: "Nuclear", weight: 12 },
          { sector: "Defense", weight: 10 },
          { sector: "Space", weight: 5 },
        ],
      },
    },
    {
      id: "earnings-bar",
      type: "bar",
      title: "Forward EPS Comparison",
      span: { cols: 6 },
      config: {
        xKey: "ticker",
        yKeys: ["eps_current", "eps_forward"],
        stacked: false,
      },
      data: {
        series: [
          { ticker: "GOOGL", eps_current: 7.21, eps_forward: 8.95 },
          { ticker: "MSFT", eps_current: 11.54, eps_forward: 13.2 },
          { ticker: "APP", eps_current: 5.67, eps_forward: 7.8 },
          { ticker: "ALAB", eps_current: 1.23, eps_forward: 2.45 },
          { ticker: "UNH", eps_current: 24.85, eps_forward: 27.5 },
        ],
      },
    },
    {
      id: "radar-quality",
      type: "radar",
      title: "Quality Score Radar",
      span: { cols: 6 },
      config: { nameKey: "metric", dataKeys: ["GOOGL", "MSFT", "ALAB"] },
      data: {
        series: [
          { metric: "Growth", GOOGL: 85, MSFT: 78, ALAB: 92 },
          { metric: "Margin", GOOGL: 90, MSFT: 88, ALAB: 65 },
          { metric: "Moat", GOOGL: 95, MSFT: 92, ALAB: 70 },
          { metric: "Valuation", GOOGL: 75, MSFT: 65, ALAB: 80 },
          { metric: "Momentum", GOOGL: 70, MSFT: 72, ALAB: 88 },
        ],
      },
    },
    {
      id: "watchlist-table",
      type: "table",
      title: "Watchlist Rankings",
      span: { cols: 12 },
      config: {
        columns: [
          { key: "rank", label: "#", width: 50, sortable: true },
          { key: "ticker", label: "Ticker", width: 90 },
          { key: "name", label: "Name", width: 180 },
          {
            key: "price",
            label: "Price",
            width: 90,
            format: "currency",
            sortable: true,
          },
          {
            key: "change_pct",
            label: "Chg%",
            width: 80,
            format: "percent",
            colorCode: true,
            sortable: true,
          },
          {
            key: "pe_fwd",
            label: "Fwd PE",
            width: 80,
            format: "number",
            sortable: true,
          },
          {
            key: "peg",
            label: "PEG",
            width: 70,
            format: "number",
            sortable: true,
          },
          {
            key: "score",
            label: "Score",
            width: 80,
            format: "number",
            sortable: true,
            bar: true,
          },
        ],
        pageSize: 8,
        searchable: true,
      },
      data: {
        rows: [
          {
            rank: 1,
            ticker: "GOOGL",
            name: "Alphabet Inc",
            price: 178.5,
            change_pct: 1.23,
            pe_fwd: 19.9,
            peg: 0.85,
            score: 94,
          },
          {
            rank: 2,
            ticker: "MSFT",
            name: "Microsoft Corp",
            price: 428.3,
            change_pct: 0.45,
            pe_fwd: 32.5,
            peg: 1.92,
            score: 91,
          },
          {
            rank: 3,
            ticker: "APP",
            name: "AppLovin Corp",
            price: 312.7,
            change_pct: 2.1,
            pe_fwd: 40.1,
            peg: 0.78,
            score: 89,
          },
          {
            rank: 4,
            ticker: "UNH",
            name: "UnitedHealth Grp",
            price: 521.4,
            change_pct: -0.3,
            pe_fwd: 18.9,
            peg: 1.45,
            score: 87,
          },
          {
            rank: 5,
            ticker: "ALAB",
            name: "Astera Labs",
            price: 87.2,
            change_pct: 3.5,
            pe_fwd: 55.2,
            peg: 0.62,
            score: 85,
          },
          {
            rank: 6,
            ticker: "NVDA",
            name: "NVIDIA Corp",
            price: 142.8,
            change_pct: 1.8,
            pe_fwd: 35.4,
            peg: 1.12,
            score: 83,
          },
          {
            rank: 7,
            ticker: "PLTR",
            name: "Palantir Tech",
            price: 78.9,
            change_pct: -1.2,
            pe_fwd: 95.3,
            peg: 2.85,
            score: 76,
          },
          {
            rank: 8,
            ticker: "VST",
            name: "Vistra Corp",
            price: 134.5,
            change_pct: 0.9,
            pe_fwd: 22.1,
            peg: 0.95,
            score: 80,
          },
          {
            rank: 9,
            ticker: "LMT",
            name: "Lockheed Martin",
            price: 478.2,
            change_pct: 0.3,
            pe_fwd: 17.8,
            peg: 2.1,
            score: 74,
          },
          {
            rank: 10,
            ticker: "RKLB",
            name: "Rocket Lab USA",
            price: 24.6,
            change_pct: 4.2,
            pe_fwd: null,
            peg: null,
            score: 71,
          },
        ],
      },
    },
    {
      id: "area-volume",
      type: "area",
      title: "Trading Volume (GOOGL)",
      span: { cols: 6 },
      config: { xKey: "date", yKeys: ["volume"], gradient: true },
      data: {
        series: Array.from({ length: 20 }, (_, i) => ({
          date: `03/${String(i + 4).padStart(2, "0")}`,
          volume: +(25 + Math.random() * 35).toFixed(1),
        })),
      },
    },
    {
      id: "scatter-val",
      type: "scatter",
      title: "PEG vs Forward PE",
      span: { cols: 6 },
      config: {
        xKey: "pe_fwd",
        yKey: "peg",
        nameKey: "ticker",
        sizeKey: "mcap",
      },
      data: {
        series: [
          { ticker: "GOOGL", pe_fwd: 19.9, peg: 0.85, mcap: 2200 },
          { ticker: "MSFT", pe_fwd: 32.5, peg: 1.92, mcap: 3100 },
          { ticker: "NVDA", pe_fwd: 35.4, peg: 1.12, mcap: 3500 },
          { ticker: "ALAB", pe_fwd: 55.2, peg: 0.62, mcap: 12 },
          { ticker: "APP", pe_fwd: 40.1, peg: 0.78, mcap: 110 },
          { ticker: "PLTR", pe_fwd: 95.3, peg: 2.85, mcap: 180 },
        ],
      },
    },
    {
      id: "treemap-mcap",
      type: "treemap",
      title: "Market Cap Treemap",
      span: { cols: 6 },
      config: { nameKey: "name", valueKey: "size", colorKey: "change" },
      data: {
        series: [
          { name: "GOOGL", size: 2200, change: 1.2 },
          { name: "MSFT", size: 3100, change: 0.4 },
          { name: "NVDA", size: 3500, change: 1.8 },
          { name: "ALAB", size: 120, change: 3.5 },
          { name: "APP", size: 110, change: 2.1 },
          { name: "UNH", size: 480, change: -0.3 },
        ],
      },
    },
    {
      id: "gauge-fear",
      type: "gauge",
      title: "Fear & Greed Index",
      span: { cols: 3 },
      config: {
        min: 0,
        max: 100,
        thresholds: [25, 45, 55, 75],
        labels: ["Extreme Fear", "Fear", "Neutral", "Greed", "Extreme Greed"],
      },
      data: { value: 72 },
    },
    {
      id: "candlestick-demo",
      type: "candlestick",
      title: "ALAB Candlestick (10D)",
      span: { cols: 9 },
      config: {
        dateKey: "date",
        openKey: "open",
        highKey: "high",
        lowKey: "low",
        closeKey: "close",
      },
      data: {
        series: Array.from({ length: 10 }, (_, i) => {
          const base = 82 + i * 0.5 + Math.random() * 4;
          const o = +base.toFixed(2);
          const c = +(base + (Math.random() - 0.4) * 5).toFixed(2);
          return {
            date: `03/${String(i + 14).padStart(2, "0")}`,
            open: o,
            high: +(Math.max(o, c) + Math.random() * 2).toFixed(2),
            low: +(Math.min(o, c) - Math.random() * 2).toFixed(2),
            close: c,
          };
        }),
      },
    },
    {
      id: "json-raw",
      type: "json",
      title: "Raw JSON Preview",
      span: { cols: 6 },
      data: {
        content: {
          note: "Any raw JSON data can be rendered as a collapsible tree",
          nested: { example: [1, 2, 3], deep: { value: true } },
        },
      },
    },
    {
      id: "md-notes",
      type: "markdown",
      title: "Analysis Notes",
      span: { cols: 6 },
      data: {
        content:
          "### Key Takeaways\n\n- **GOOGL** remains top-ranked with best PEG ratio among Mag7\n- **ALAB** shows high momentum but elevated PE — watch Scorpio X catalyst\n- Nuclear & Defense themes showing relative strength\n- VIX at 14.3 suggests low near-term volatility expectations\n\n> *Generated by automated pipeline — verify before trading*",
      },
    },
  ],
};

// ============================================================
// WIDGET RENDERERS
// ============================================================

function KPIWidget({ widget }) {
  const items = widget.data?.items || [];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))`,
        gap: 12,
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: THEME.bg,
            borderRadius: 10,
            padding: "14px 16px",
            border: `1px solid ${THEME.border}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: THEME.textDim,
              fontFamily: THEME.fontSans,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {item.label}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              fontFamily: THEME.font,
              color: THEME.text,
            }}
          >
            {item.prefix || ""}
            {typeof item.value === "number"
              ? item.value.toLocaleString()
              : item.value}
            {item.suffix || ""}
          </div>
          {item.change !== undefined && (
            <div
              style={{
                fontSize: 12,
                fontFamily: THEME.font,
                marginTop: 4,
                color: item.change >= 0 ? THEME.positive : THEME.negative,
              }}
            >
              {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change)}%
            </div>
          )}
          {item.badge && (
            <div
              style={{
                marginTop: 6,
                display: "inline-block",
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 20,
                background: "rgba(251,191,36,0.15)",
                color: THEME.warn,
                fontFamily: THEME.fontSans,
              }}
            >
              {item.badge}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ChartWidget({ widget }) {
  const { type, config = {}, data = {} } = widget;
  const series = data.series || [];
  const {
    xKey = "x",
    yKeys = [],
    smooth = false,
    dot = true,
    areaFill = false,
    gradient = false,
    stacked = false,
  } = config;

  const autoYKeys =
    yKeys.length > 0
      ? yKeys
      : series[0]
        ? Object.keys(series[0]).filter(
            (k) => k !== xKey && typeof series[0][k] === "number",
          )
        : [];

  const ChartComp =
    type === "bar"
      ? BarChart
      : type === "area"
        ? AreaChart
        : type === "composed"
          ? ComposedChart
          : LineChart;
  const SeriesComp = type === "bar" ? Bar : type === "area" ? Area : Line;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ChartComp
        data={series}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: THEME.textDim, fontSize: 11, fontFamily: THEME.font }}
          stroke={THEME.border}
        />
        <YAxis
          tick={{ fill: THEME.textDim, fontSize: 11, fontFamily: THEME.font }}
          stroke={THEME.border}
        />
        <Tooltip
          contentStyle={{
            background: THEME.surface,
            border: `1px solid ${THEME.border}`,
            borderRadius: 8,
            fontFamily: THEME.font,
            fontSize: 12,
            color: THEME.text,
          }}
        />
        {autoYKeys.length > 1 && (
          <Legend wrapperStyle={{ fontFamily: THEME.fontSans, fontSize: 12 }} />
        )}
        {gradient && (
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={THEME.accent} stopOpacity={0.4} />
              <stop offset="100%" stopColor={THEME.accent} stopOpacity={0.02} />
            </linearGradient>
          </defs>
        )}
        {autoYKeys.map((k, i) => {
          const color = THEME.colors[i % THEME.colors.length];
          if (type === "area" || areaFill) {
            return (
              <Area
                key={k}
                type={smooth ? "monotone" : "linear"}
                dataKey={k}
                stroke={color}
                fill={gradient ? "url(#areaGrad)" : color}
                fillOpacity={gradient ? 1 : 0.15}
                dot={dot}
                strokeWidth={2}
              />
            );
          }
          if (type === "bar") {
            return (
              <Bar
                key={k}
                dataKey={k}
                fill={color}
                radius={[4, 4, 0, 0]}
                stackId={stacked ? "s" : undefined}
              />
            );
          }
          return (
            <Line
              key={k}
              type={smooth ? "monotone" : "linear"}
              dataKey={k}
              stroke={color}
              dot={dot}
              strokeWidth={2}
            />
          );
        })}
      </ChartComp>
    </ResponsiveContainer>
  );
}

function PieWidget({ widget }) {
  const { config = {}, data = {} } = widget;
  const { nameKey = "name", valueKey = "value", donut = false } = config;
  const series = data.series || [];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={series}
          dataKey={valueKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          innerRadius={donut ? 55 : 0}
          outerRadius={95}
          paddingAngle={2}
          strokeWidth={0}
        >
          {series.map((_, i) => (
            <Cell key={i} fill={THEME.colors[i % THEME.colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: THEME.surface,
            border: `1px solid ${THEME.border}`,
            borderRadius: 8,
            fontFamily: THEME.font,
            fontSize: 12,
            color: THEME.text,
          }}
        />
        <Legend wrapperStyle={{ fontFamily: THEME.fontSans, fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function RadarWidget({ widget }) {
  const { config = {}, data = {} } = widget;
  const { nameKey = "name", dataKeys = [] } = config;
  const series = data.series || [];
  const autoKeys =
    dataKeys.length > 0
      ? dataKeys
      : series[0]
        ? Object.keys(series[0]).filter(
            (k) => k !== nameKey && typeof series[0][k] === "number",
          )
        : [];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={series} cx="50%" cy="50%" outerRadius={90}>
        <PolarGrid stroke={THEME.border} />
        <PolarAngleAxis
          dataKey={nameKey}
          tick={{ fill: THEME.textDim, fontSize: 11, fontFamily: THEME.font }}
        />
        <PolarRadiusAxis
          tick={{ fill: THEME.textDim, fontSize: 9 }}
          stroke={THEME.border}
        />
        {autoKeys.map((k, i) => (
          <Radar
            key={k}
            name={k}
            dataKey={k}
            stroke={THEME.colors[i % THEME.colors.length]}
            fill={THEME.colors[i % THEME.colors.length]}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        ))}
        <Legend wrapperStyle={{ fontFamily: THEME.fontSans, fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            background: THEME.surface,
            border: `1px solid ${THEME.border}`,
            borderRadius: 8,
            fontFamily: THEME.font,
            fontSize: 12,
            color: THEME.text,
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function ScatterWidget({ widget }) {
  const { config = {}, data = {} } = widget;
  const { xKey = "x", yKey = "y", nameKey, sizeKey } = config;
  const series = data.series || [];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
        <XAxis
          dataKey={xKey}
          name={xKey}
          tick={{ fill: THEME.textDim, fontSize: 11, fontFamily: THEME.font }}
          stroke={THEME.border}
        />
        <YAxis
          dataKey={yKey}
          name={yKey}
          tick={{ fill: THEME.textDim, fontSize: 11, fontFamily: THEME.font }}
          stroke={THEME.border}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{
            background: THEME.surface,
            border: `1px solid ${THEME.border}`,
            borderRadius: 8,
            fontFamily: THEME.font,
            fontSize: 12,
            color: THEME.text,
          }}
          formatter={(val, name) => [val, name]}
          labelFormatter={(v) => `${xKey}: ${v}`}
        />
        <Scatter data={series} fill={THEME.accent}>
          {series.map((entry, i) => (
            <Cell key={i} fill={THEME.colors[i % THEME.colors.length]} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function TreemapWidget({ widget }) {
  const { config = {}, data = {} } = widget;
  const { nameKey = "name", valueKey = "value" } = config;
  const series = (data.series || []).map((d) => ({
    ...d,
    name: d[nameKey],
    size: d[valueKey],
  }));
  const CustomContent = ({ x, y, width, height, name, size }) => {
    if (width < 30 || height < 25) return null;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={4}
          fill={
            THEME.colors[
              Math.abs(String(name).charCodeAt(0)) % THEME.colors.length
            ]
          }
          fillOpacity={0.7}
          stroke={THEME.bg}
          strokeWidth={2}
        />
        <text
          x={x + width / 2}
          y={y + height / 2 - 6}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          fontFamily={THEME.font}
          fontWeight={700}
        >
          {name}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          textAnchor="middle"
          fill="rgba(255,255,255,0.65)"
          fontSize={10}
          fontFamily={THEME.font}
        >
          {size?.toLocaleString()}
        </text>
      </g>
    );
  };
  return (
    <ResponsiveContainer width="100%" height={260}>
      <Treemap
        data={series}
        dataKey="size"
        aspectRatio={4 / 3}
        content={<CustomContent />}
      />
    </ResponsiveContainer>
  );
}

function CandlestickWidget({ widget }) {
  const { config = {}, data = {} } = widget;
  const {
    dateKey = "date",
    openKey = "open",
    highKey = "high",
    lowKey = "low",
    closeKey = "close",
  } = config;
  const series = data.series || [];
  if (!series.length) return null;
  const allVals = series.flatMap((d) => [d[highKey], d[lowKey]]);
  const minY = Math.floor(Math.min(...allVals) - 1);
  const maxY = Math.ceil(Math.max(...allVals) + 1);
  const w = 100 / series.length;
  return (
    <div style={{ width: "100%", height: 260, position: "relative" }}>
      <svg
        viewBox={`0 0 ${series.length * 50} 240`}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        {series.map((d, i) => {
          const x = i * 50 + 25;
          const scale = (v) => 230 - ((v - minY) / (maxY - minY)) * 220 + 5;
          const o = d[openKey],
            c = d[closeKey],
            h = d[highKey],
            l = d[lowKey];
          const bull = c >= o;
          const color = bull ? THEME.positive : THEME.negative;
          const bodyTop = scale(Math.max(o, c));
          const bodyBot = scale(Math.min(o, c));
          return (
            <g key={i}>
              <line
                x1={x}
                x2={x}
                y1={scale(h)}
                y2={scale(l)}
                stroke={color}
                strokeWidth={1.5}
              />
              <rect
                x={x - 12}
                y={bodyTop}
                width={24}
                height={Math.max(bodyBot - bodyTop, 2)}
                fill={bull ? color : color}
                rx={2}
                opacity={bull ? 0.85 : 0.85}
              />
              <text
                x={x}
                y={238}
                textAnchor="middle"
                fill={THEME.textDim}
                fontSize={9}
                fontFamily={THEME.font}
              >
                {d[dateKey]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function GaugeWidget({ widget }) {
  const { config = {}, data = {} } = widget;
  const { min = 0, max = 100, thresholds = [25, 50, 75], labels = [] } = config;
  const val = data.value ?? 50;
  const pct = (val - min) / (max - min);
  const angle = -135 + pct * 270;
  const getColor = () => {
    const idx = thresholds.findIndex((t) => val < t);
    const ci = idx === -1 ? thresholds.length : idx;
    return (
      [THEME.negative, "#F97316", THEME.warn, THEME.accentAlt, THEME.positive][
        ci
      ] || THEME.accent
    );
  };
  const label = labels.length
    ? labels[
        thresholds.findIndex((t) => val < t) === -1
          ? thresholds.length
          : thresholds.findIndex((t) => val < t)
      ]
    : "";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px 0",
      }}
    >
      <svg width={180} height={120} viewBox="0 0 180 120">
        <path
          d="M 20 100 A 70 70 0 1 1 160 100"
          fill="none"
          stroke={THEME.border}
          strokeWidth={12}
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 70 70 0 1 1 160 100"
          fill="none"
          stroke={getColor()}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${pct * 330} 330`}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        <text
          x={90}
          y={85}
          textAnchor="middle"
          fill={THEME.text}
          fontSize={28}
          fontFamily={THEME.font}
          fontWeight={700}
        >
          {val}
        </text>
      </svg>
      {label && (
        <div
          style={{
            fontSize: 13,
            color: getColor(),
            fontFamily: THEME.fontSans,
            fontWeight: 600,
            marginTop: 2,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

function TableWidget({ widget }) {
  const { config = {}, data = {} } = widget;
  const { columns = [], pageSize = 10, searchable = false } = config;
  const rows = data.rows || [];
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const autoCols =
    columns.length > 0
      ? columns
      : rows[0]
        ? Object.keys(rows[0]).map((k) => ({ key: k, label: k }))
        : [];

  const filtered = useMemo(() => {
    let r = rows;
    if (search)
      r = r.filter((row) =>
        autoCols.some((c) =>
          String(row[c.key] || "")
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
      );
    if (sortKey)
      r = [...r].sort((a, b) => {
        const va = a[sortKey],
          vb = b[sortKey];
        if (va == null) return 1;
        if (vb == null) return -1;
        return sortDir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
      });
    return r;
  }, [rows, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageRows = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const fmtVal = (val, col) => {
    if (val == null) return "—";
    if (col.format === "currency")
      return `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    if (col.format === "percent") return `${val > 0 ? "+" : ""}${val}%`;
    if (col.format === "number") return Number(val).toLocaleString();
    return String(val);
  };

  return (
    <div>
      {searchable && (
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search..."
          style={{
            width: "100%",
            padding: "8px 12px",
            marginBottom: 10,
            background: THEME.bg,
            border: `1px solid ${THEME.border}`,
            borderRadius: 8,
            color: THEME.text,
            fontFamily: THEME.font,
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      )}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontFamily: THEME.font,
            fontSize: 12,
          }}
        >
          <thead>
            <tr>
              {autoCols.map((c) => (
                <th
                  key={c.key}
                  onClick={() => {
                    if (c.sortable !== false) {
                      setSortKey(c.key);
                      setSortDir(
                        sortKey === c.key && sortDir === "asc" ? "desc" : "asc",
                      );
                    }
                  }}
                  style={{
                    padding: "8px 10px",
                    textAlign: "left",
                    color: THEME.textDim,
                    borderBottom: `1px solid ${THEME.border}`,
                    cursor: c.sortable !== false ? "pointer" : "default",
                    whiteSpace: "nowrap",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    userSelect: "none",
                    width: c.width || "auto",
                  }}
                >
                  {c.label || c.key}{" "}
                  {sortKey === c.key ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, ri) => (
              <tr
                key={ri}
                style={{
                  background:
                    ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                }}
              >
                {autoCols.map((c) => {
                  const val = row[c.key];
                  const color =
                    c.colorCode && typeof val === "number"
                      ? val >= 0
                        ? THEME.positive
                        : THEME.negative
                      : THEME.text;
                  return (
                    <td
                      key={c.key}
                      style={{
                        padding: "7px 10px",
                        borderBottom: `1px solid ${THEME.border}`,
                        color,
                        whiteSpace: "nowrap",
                        position: "relative",
                      }}
                    >
                      {c.bar && typeof val === "number" && (
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${Math.min(val, 100)}%`,
                            background: THEME.accent,
                            opacity: 0.12,
                            borderRadius: 4,
                          }}
                        />
                      )}
                      <span style={{ position: "relative" }}>
                        {fmtVal(val, c)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 10,
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                border: `1px solid ${i === page ? THEME.accent : THEME.border}`,
                background: i === page ? THEME.accent : "transparent",
                color: i === page ? "#fff" : THEME.textDim,
                cursor: "pointer",
                fontFamily: THEME.font,
                fontSize: 11,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MarkdownWidget({ widget }) {
  const md = widget.data?.content || "";
  const html = md
    .replace(
      /^### (.+)$/gm,
      '<h3 style="margin:10px 0 6px;font-size:16px;color:#E2E8F0">$1</h3>',
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 style="margin:12px 0 8px;font-size:18px;color:#E2E8F0">$2</h2>',
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#E2E8F0">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /^> (.+)$/gm,
      '<blockquote style="border-left:3px solid #6366F1;padding-left:12px;margin:8px 0;color:#94A3B8;font-style:italic">$1</blockquote>',
    )
    .replace(
      /^- (.+)$/gm,
      '<div style="padding-left:16px;margin:3px 0">• $1</div>',
    )
    .replace(/\n\n/g, "<br/>");
  return (
    <div
      style={{
        fontFamily: THEME.fontSans,
        fontSize: 14,
        lineHeight: 1.7,
        color: THEME.textDim,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function JsonWidget({ widget }) {
  const content = widget.data?.content || {};
  const [expanded, setExpanded] = useState(true);
  return (
    <div
      style={{
        fontFamily: THEME.font,
        fontSize: 12,
        lineHeight: 1.6,
        maxHeight: 300,
        overflow: "auto",
      }}
    >
      <pre
        style={{
          margin: 0,
          color: THEME.textDim,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}
      >
        {JSON.stringify(content, null, 2)}
      </pre>
    </div>
  );
}

// ============================================================
// WIDGET ROUTER
// ============================================================
function WidgetRenderer({ widget }) {
  const map = {
    kpi: KPIWidget,
    line: ChartWidget,
    bar: ChartWidget,
    area: ChartWidget,
    composed: ChartWidget,
    pie: PieWidget,
    radar: RadarWidget,
    scatter: ScatterWidget,
    treemap: TreemapWidget,
    candlestick: CandlestickWidget,
    gauge: GaugeWidget,
    table: TableWidget,
    markdown: MarkdownWidget,
    json: JsonWidget,
  };
  const Comp = map[widget.type];
  if (!Comp)
    return (
      <div
        style={{ color: THEME.negative, fontFamily: THEME.font, fontSize: 13 }}
      >
        Unknown widget type: <code>{widget.type}</code>
      </div>
    );
  return <Comp widget={widget} />;
}

// ============================================================
// CHAT BOX (OpenClaw)
// ============================================================
function extractDashboard(text) {
  // Try ```json ... ``` block first
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidates = fenced ? [fenced[1], text] : [text];
  for (const candidate of candidates) {
    const match = candidate.match(/\{[\s\S]*\}/);
    if (!match) continue;
    try {
      const obj = JSON.parse(match[0]);
      if (
        obj.meta?.title &&
        Array.isArray(obj.widgets) &&
        obj.widgets.length > 0
      )
        return obj;
    } catch {}
  }
  return null;
}

function ChatBox({ onClose, onApplyDashboard }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("openclaw_config");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { endpoint: "/openclaw", token: "", agentId: "main" };
  });

  useEffect(() => {
    try {
      localStorage.setItem("openclaw_config", JSON.stringify(config));
    } catch {}
  }, [config]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || streaming) return;
    const userContent = input.trim();
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userContent },
      { role: "assistant", content: "" },
    ]);
    setInput("");
    setStreaming(true);
    try {
      const res = await fetch(`${config.endpoint}/v1/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(config.token && { Authorization: `Bearer ${config.token}` }),
          ...(config.agentId && { "x-openclaw-agent-id": config.agentId }),
        },
        body: JSON.stringify({
          model: "openclaw",
          stream: true,
          input: userContent,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") continue;
          try {
            const ev = JSON.parse(raw);
            if (ev.type === "response.output_text.delta" && ev.delta) {
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                  ...next[next.length - 1],
                  content: next[next.length - 1].content + ev.delta,
                };
                return next;
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          ...next[next.length - 1],
          content: `Error: ${e.message}`,
        };
        return next;
      });
    } finally {
      setStreaming(false);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && onApplyDashboard) {
          const parsed = extractDashboard(last.content);
          if (parsed) onApplyDashboard(parsed);
        }
        return prev;
      });
    }
  };

  const configFields = [
    {
      label: "Endpoint",
      key: "endpoint",
      placeholder: "http://localhost:18789",
    },
    { label: "Bearer Token", key: "token", placeholder: "(optional)" },
    { label: "Agent ID", key: "agentId", placeholder: "main" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        right: 28,
        width: 380,
        height: 520,
        background: THEME.surface,
        border: `1px solid ${THEME.border}`,
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "13px 16px",
          borderBottom: `1px solid ${THEME.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: THEME.font,
            fontSize: 13,
            fontWeight: 600,
            color: THEME.text,
          }}
        >
          <span style={{ color: THEME.accentAlt }}>◈</span> OpenClaw Chat
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => setShowConfig((v) => !v)}
            style={{
              background: showConfig ? "rgba(99,102,241,0.15)" : "none",
              border: `1px solid ${showConfig ? THEME.accent : "transparent"}`,
              borderRadius: 6,
              color: showConfig ? THEME.accent : THEME.textDim,
              cursor: "pointer",
              fontSize: 13,
              padding: "2px 8px",
              fontFamily: THEME.font,
            }}
          >
            ⚙
          </button>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid transparent",
              borderRadius: 6,
              color: THEME.textDim,
              cursor: "pointer",
              fontSize: 15,
              padding: "2px 8px",
              fontFamily: THEME.font,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Config panel */}
      {showConfig && (
        <div
          style={{
            padding: "10px 14px",
            borderBottom: `1px solid ${THEME.border}`,
            background: THEME.bg,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flexShrink: 0,
          }}
        >
          {configFields.map(({ label, key, placeholder }) => (
            <div key={key}>
              <div
                style={{
                  fontSize: 10,
                  color: THEME.textDim,
                  fontFamily: THEME.font,
                  marginBottom: 3,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {label}
              </div>
              <input
                value={config[key]}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, [key]: e.target.value }))
                }
                placeholder={placeholder}
                type={key === "token" ? "password" : "text"}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  background: THEME.surface,
                  border: `1px solid ${THEME.border}`,
                  borderRadius: 6,
                  color: THEME.text,
                  fontFamily: THEME.font,
                  fontSize: 12,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 14px 6px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              color: THEME.textDim,
              fontFamily: THEME.fontSans,
              fontSize: 13,
              textAlign: "center",
              marginTop: 60,
              lineHeight: 1.8,
            }}
          >
            Ask OpenClaw anything...
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "82%",
                padding: "8px 12px",
                borderRadius:
                  msg.role === "user"
                    ? "12px 12px 2px 12px"
                    : "12px 12px 12px 2px",
                background: msg.role === "user" ? THEME.accent : THEME.bg,
                color: THEME.text,
                fontFamily: THEME.fontSans,
                fontSize: 13,
                lineHeight: 1.55,
                border:
                  msg.role === "assistant"
                    ? `1px solid ${THEME.border}`
                    : "none",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {msg.content ||
                (msg.role === "assistant" && streaming ? (
                  <span
                    style={{ color: THEME.textDim, fontFamily: THEME.font }}
                  >
                    ▋
                  </span>
                ) : null)}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "10px 12px 14px",
          borderTop: `1px solid ${THEME.border}`,
          display: "flex",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Message OpenClaw..."
          disabled={streaming}
          style={{
            flex: 1,
            padding: "8px 12px",
            background: THEME.bg,
            border: `1px solid ${THEME.border}`,
            borderRadius: 8,
            color: THEME.text,
            fontFamily: THEME.fontSans,
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={streaming || !input.trim()}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            background:
              streaming || !input.trim() ? THEME.border : THEME.accent,
            color: "#fff",
            cursor: streaming || !input.trim() ? "default" : "pointer",
            fontFamily: THEME.font,
            fontSize: 13,
            fontWeight: 600,
            transition: "background 0.15s",
          }}
        >
          {streaming ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD
// ============================================================
function WidgetCard({ widget }) {
  const span = widget.span || {};
  const cols = span.cols || 6;
  return (
    <div
      style={{
        gridColumn: `span ${cols}`,
        background: THEME.surface,
        borderRadius: 14,
        border: `1px solid ${THEME.border}`,
        padding: "18px 20px",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {widget.title && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 14,
              fontFamily: THEME.fontSans,
              fontWeight: 600,
              color: THEME.text,
              letterSpacing: "-0.01em",
            }}
          >
            {widget.title}
          </h3>
          <span
            style={{
              fontSize: 10,
              fontFamily: THEME.font,
              color: THEME.textDim,
              background: THEME.bg,
              padding: "2px 8px",
              borderRadius: 6,
            }}
          >
            {widget.type}
          </span>
        </div>
      )}
      <WidgetRenderer widget={widget} />
    </div>
  );
}

export default function DashboardEngine({ dashboardData, onApplyDashboard }) {
  const [mode, setMode] = useState("dashboard");
  const [jsonText, setJsonText] = useState(
    JSON.stringify(dashboardData || SAMPLE_DASHBOARD, null, 2),
  );
  const [dashboard, setDashboard] = useState(dashboardData || null);
  const [error, setError] = useState(null);
  const [chatOpen, setChatOpen] = useState(!dashboardData);

  useEffect(() => {
    setDashboard(dashboardData || null);
    if (dashboardData) {
      setJsonText(JSON.stringify(dashboardData, null, 2));
      setMode("dashboard");
      setError(null);
      setChatOpen(false);
    }
  }, [dashboardData]);

  const applyJson = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      setDashboard(parsed);
      setError(null);
      setMode("dashboard");
    } catch (e) {
      setError(e.message);
    }
  }, [jsonText]);

  const gap = dashboard?.layout?.gap || 16;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: THEME.bg,
        color: THEME.text,
        fontFamily: THEME.fontSans,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 28px",
          borderBottom: `1px solid ${THEME.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              fontFamily: THEME.font,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: THEME.accent }}>⬡</span> Dashboard Engine
          </h1>
          {dashboard?.meta?.title && (
            <p
              style={{ margin: "4px 0 0", fontSize: 12, color: THEME.textDim }}
            >
              {dashboard.meta.title}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 28 }}>
        {mode === "dashboard" && !dashboard && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              gap: 16,
              color: THEME.textDim,
              fontFamily: THEME.fontSans,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, opacity: 0.2 }}>◈</div>
            <div style={{ fontSize: 16, color: THEME.text, fontWeight: 600 }}>
              No dashboard loaded
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 320 }}>
              Chat with OpenClaw to generate a dashboard,
              <br />
              or select one from the sidebar.
            </div>
            <button
              onClick={() => setChatOpen(true)}
              style={{
                marginTop: 8,
                padding: "8px 20px",
                borderRadius: 8,
                border: `1px solid ${THEME.accent}`,
                background: "rgba(99,102,241,0.15)",
                color: THEME.accent,
                cursor: "pointer",
                fontFamily: THEME.font,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Open Chat
            </button>
          </div>
        )}

        {mode === "dashboard" && dashboard && (
          <>
            {dashboard.meta?.description && (
              <p
                style={{
                  fontSize: 12,
                  color: THEME.textDim,
                  marginTop: 0,
                  marginBottom: 20,
                  fontFamily: THEME.font,
                }}
              >
                {dashboard.meta.description}{" "}
                {dashboard.meta.generated_at &&
                  `• ${dashboard.meta.generated_at}`}
              </p>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
                gap,
                maxWidth: 1400,
              }}
            >
              {(dashboard.widgets || []).map((w) => (
                <WidgetCard key={w.id} widget={w} />
              ))}
            </div>
          </>
        )}

        {mode === "editor" && (
          <div style={{ maxWidth: 1000 }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 12,
                alignItems: "center",
              }}
            >
              <button
                onClick={applyJson}
                style={{
                  padding: "8px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: THEME.accent,
                  color: "#fff",
                  cursor: "pointer",
                  fontFamily: THEME.font,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                ▶ Apply & Render
              </button>
              <button
                onClick={() => {
                  setJsonText(JSON.stringify(SAMPLE_DASHBOARD, null, 2));
                  setDashboard(SAMPLE_DASHBOARD);
                  setError(null);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: `1px solid ${THEME.border}`,
                  background: "transparent",
                  color: THEME.textDim,
                  cursor: "pointer",
                  fontFamily: THEME.font,
                  fontSize: 12,
                }}
              >
                Reset Sample
              </button>
              {error && (
                <span
                  style={{
                    color: THEME.negative,
                    fontFamily: THEME.font,
                    fontSize: 12,
                  }}
                >
                  ⚠ {error}
                </span>
              )}
            </div>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              spellCheck={false}
              style={{
                width: "100%",
                minHeight: 600,
                padding: 16,
                background: THEME.surface,
                border: `1px solid ${THEME.border}`,
                borderRadius: 12,
                color: THEME.text,
                fontFamily: THEME.font,
                fontSize: 12,
                lineHeight: 1.5,
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
                tabSize: 2,
              }}
            />
          </div>
        )}

        {mode === "schema" && (
          <div
            style={{
              maxWidth: 900,
              fontFamily: THEME.font,
              fontSize: 13,
              lineHeight: 1.8,
              color: THEME.textDim,
            }}
          >
            <h2
              style={{
                color: THEME.text,
                fontFamily: THEME.fontSans,
                fontSize: 20,
                marginBottom: 20,
              }}
            >
              JSON Schema Reference
            </h2>
            <SchemaDoc />
          </div>
        )}
      </div>

      {/* Floating chat toggle */}
      <button
        onClick={() => setChatOpen((v) => !v)}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: `1px solid ${chatOpen ? THEME.accentAlt : THEME.border}`,
          background: chatOpen ? "rgba(34,211,238,0.15)" : THEME.surface,
          color: chatOpen ? THEME.accentAlt : THEME.textDim,
          cursor: "pointer",
          fontSize: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          zIndex: 1001,
          transition: "all 0.15s",
        }}
        title="OpenClaw Chat"
      >
        ◈
      </button>

      {/* Chat panel */}
      {chatOpen && (
        <ChatBox
          onClose={() => setChatOpen(false)}
          onApplyDashboard={onApplyDashboard}
        />
      )}
    </div>
  );
}

function SchemaDoc() {
  const sections = [
    {
      title: "Top-Level Structure",
      code: `{
  "meta": { "title": "...", "description": "...", "generated_at": "ISO8601", "version": "1.0" },
  "layout": { "columns": 12, "gap": 16 },
  "widgets": [ ... ]
}`,
    },
    {
      title: "Widget Base",
      code: `{
  "id": "unique-id",
  "type": "kpi | line | bar | area | pie | radar | scatter | composed | treemap | candlestick | gauge | table | markdown | json",
  "title": "Widget Title",
  "span": { "cols": 6 },   // 1-12 grid columns
  "config": { ... },        // type-specific config
  "data": { ... }           // type-specific data
}`,
    },
    {
      title: 'type: "kpi"',
      code: `data: {
  items: [
    { label: "S&P 500", value: 5892.41, change: 1.23, prefix: "$", suffix: "%", format: "number", badge: "Label" }
  ]
}`,
    },
    {
      title: 'type: "line" | "bar" | "area" | "composed"',
      code: `config: { xKey: "date", yKeys: ["close","sma20"], smooth: true, dot: false, areaFill: true, gradient: true, stacked: false }
data: { series: [ { date: "03/01", close: 178.5, sma20: 175.2 }, ... ] }`,
    },
    {
      title: 'type: "pie"',
      code: `config: { nameKey: "sector", valueKey: "weight", donut: true }
data: { series: [ { sector: "AI", weight: 28 }, ... ] }`,
    },
    {
      title: 'type: "radar"',
      code: `config: { nameKey: "metric", dataKeys: ["GOOGL","MSFT"] }
data: { series: [ { metric: "Growth", GOOGL: 85, MSFT: 78 }, ... ] }`,
    },
    {
      title: 'type: "scatter"',
      code: `config: { xKey: "pe", yKey: "peg", nameKey: "ticker", sizeKey: "mcap" }
data: { series: [ { ticker: "GOOGL", pe: 19.9, peg: 0.85, mcap: 2200 }, ... ] }`,
    },
    {
      title: 'type: "candlestick"',
      code: `config: { dateKey: "date", openKey: "open", highKey: "high", lowKey: "low", closeKey: "close" }
data: { series: [ { date: "03/14", open: 82.5, high: 85.1, low: 81.2, close: 84.3 }, ... ] }`,
    },
    {
      title: 'type: "gauge"',
      code: `config: { min: 0, max: 100, thresholds: [25,45,55,75], labels: ["Extreme Fear","Fear","Neutral","Greed","Extreme Greed"] }
data: { value: 72 }`,
    },
    {
      title: 'type: "table"',
      code: `config: {
  columns: [
    { key: "ticker", label: "Ticker", width: 90, sortable: true, format: "currency|percent|number", colorCode: true, bar: true }
  ],
  pageSize: 10,
  searchable: true
}
data: { rows: [ { ticker: "GOOGL", price: 178.5 }, ... ] }`,
    },
    {
      title: 'type: "treemap"',
      code: `config: { nameKey: "name", valueKey: "size", colorKey: "change" }
data: { series: [ { name: "GOOGL", size: 2200, change: 1.2 }, ... ] }`,
    },
    {
      title: 'type: "markdown"',
      code: `data: { content: "### Title\\n\\n- bullet\\n- **bold**\\n> blockquote" }`,
    },
    {
      title: 'type: "json"',
      code: `data: { content: { any: "object", nested: { works: true } } }`,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {sections.map((s, i) => (
        <div
          key={i}
          style={{
            background: THEME.surface,
            border: `1px solid ${THEME.border}`,
            borderRadius: 12,
            padding: "14px 18px",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px",
              fontSize: 14,
              color: THEME.accent,
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            {s.title}
          </h3>
          <pre
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.6,
              color: THEME.text,
              whiteSpace: "pre-wrap",
              overflowX: "auto",
            }}
          >
            {s.code}
          </pre>
        </div>
      ))}
    </div>
  );
}
