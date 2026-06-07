"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MacroPulse {
  dxy_trend: string;
  us_real_yield: string;
  market_volatility_vix: string;
  global_sentiment: string;
}

interface QuantData {
  rsi: number;
  ema_proximity: string;
  delivery_surge: string;
  momentum_10d: string;
  news_sentiment: number;
  current_price: number;
}

interface FundamentalData {
  roe: string;
  revenue_growth: string;
  pe_ratio: number;
  debt_equity: number;
}

interface ShortTermEquity {
  ticker: string;
  company_name: string;
  sector: string;
  probability: number;
  direction: "UPWARD" | "DOWNWARD";
  catalyst: string;
  risk_reward: string;
  quant_data: QuantData;
  fundamental_data: FundamentalData;
  is_premium: boolean;
}

interface LongTermEquity {
  ticker: string;
  company_name: string;
  sector: string;
  probability: number;
  horizon: string;
  structural_drivers: string;
  fundamental_data: FundamentalData;
  is_premium: boolean;
}

interface PreciousMetal {
  asset_name: string;
  spot_price_usd: number;
  probability: number;
  bias: string;
  macro_drivers: string;
  is_premium: boolean;
}

interface MutualFund {
  fund_name: string;
  category: string;
  amc: string;
  probability: number;
  alpha_rating: string;
  sharpe_ratio: string;
  cagr_3yr: string;
  action_outlook: string;
  is_premium: boolean;
}

interface Payload {
  generation_timestamp: string;
  pipeline_version: string;
  vix_at_generation: number;
  governor_active: boolean;
  macro_pulse: MacroPulse;
  short_term_equities: ShortTermEquity[];
  long_term_equities: LongTermEquity[];
  precious_metals: PreciousMetal[];
  mutual_funds: MutualFund[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function probColor(p: number) {
  if (p >= 85) return { text: "#059669", bg: "#d1fae5", border: "#6ee7b7" };
  if (p >= 75) return { text: "#0891b2", bg: "#cffafe", border: "#67e8f9" };
  if (p >= 65) return { text: "#d97706", bg: "#fef3c7", border: "#fcd34d" };
  return { text: "#dc2626", bg: "#fee2e2", border: "#fca5a5" };
}

function probLabel(p: number) {
  if (p >= 85) return "HIGH CONVICTION";
  if (p >= 75) return "STRONG";
  if (p >= 65) return "MODERATE";
  return "SPECULATIVE";
}

function formatTs(ts: string) {
  try {
    return new Date(ts).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }) + " IST";
  } catch { return ts; }
}

// ─── Premium Gate ─────────────────────────────────────────────────────────────

function PremiumGate({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span className="relative inline-flex items-center gap-2">
        <span className="blur-sm select-none pointer-events-none text-slate-300">{name || "████████"}</span>
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(true); }}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide"
          style={{
            background: "linear-gradient(135deg, #fef3c7, #fde68a)",
            color: "#92400e",
            border: "1px solid #fcd34d",
            boxShadow: "0 2px 8px rgba(251,191,36,0.3)",
          }}
        >
          ⚡ UNLOCK ₹29
        </button>
      </span>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(12px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: "#fff" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient top bar */}
            <div
              className="h-1.5 w-full"
              style={{ background: "linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)" }}
            />
            <div className="p-8">
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)", boxShadow: "0 8px 24px rgba(251,191,36,0.3)" }}
                >
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Institutional Research Deck</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Full quantitative analysis, multi-vector breakdown, and live conviction metrics.
                </p>
              </div>

              <div
                className="rounded-2xl p-4 mb-6"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">One-time unlock</span>
                  <span className="font-mono text-2xl font-bold text-emerald-600">₹29</span>
                </div>
                <p className="text-xs text-slate-400">Instant access · No subscription</p>
              </div>

              <a
                href="upi://pay?pa=finsightindia@upi&pn=FinSight+India&am=29&tn=Premium+Asset+Unlock&cu=INR"
                className="flex items-center justify-center w-full py-3.5 rounded-2xl text-sm font-bold text-white mb-4"
                style={{
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  boxShadow: "0 8px 24px rgba(16,185,129,0.35)",
                }}
              >
                Pay ₹29 via UPI
              </a>

              <div className="flex justify-center gap-4 text-xs text-slate-400">
                {["GPay", "PhonePe", "Paytm", "BHIM"].map((a) => <span key={a}>{a}</span>)}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors text-sm"
            >✕</button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Confidence Meter ─────────────────────────────────────────────────────────

function ConfidenceMeter({ probability }: { probability: number }) {
  const c = probColor(probability);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full overflow-hidden bg-slate-100">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${probability}%`,
            background: `linear-gradient(90deg, ${c.border}, ${c.text})`,
          }}
        />
      </div>
      <span className="font-mono text-sm font-bold tabular-nums w-10 text-right" style={{ color: c.text }}>
        {probability}%
      </span>
    </div>
  );
}

// ─── Data Cell ────────────────────────────────────────────────────────────────

function DataCell({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="rounded-xl p-3" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
      <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">{label}</div>
      <div className="font-mono text-sm font-bold" style={{ color: green ? "#059669" : "#0f172a" }}>{value || "—"}</div>
    </div>
  );
}

function DataRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="font-mono text-xs font-bold" style={{ color: green ? "#059669" : "#0f172a" }}>{value}</span>
    </div>
  );
}

// ─── Score Badge ──────────────────────────────────────────────────────────────

function ScoreBadge({ probability }: { probability: number }) {
  const c = probColor(probability);
  return (
    <div className="text-right shrink-0 ml-4">
      <div className="font-mono font-black tabular-nums leading-none" style={{ color: c.text, fontSize: "26px" }}>
        {probability}
        <span className="text-base font-bold">%</span>
      </div>
      <div
        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest mt-1"
        style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
      >
        {probLabel(probability)}
      </div>
    </div>
  );
}

// ─── ST Equity Card ───────────────────────────────────────────────────────────

type AccordionTab = "corporate" | "macro" | "trends" | "quant";

function STEquityCard({ item }: { item: ShortTermEquity }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<AccordionTab>("corporate");
  const isBull = item.direction === "UPWARD";
  const accentColor = item.is_premium ? "#f59e0b" : isBull ? "#059669" : "#dc2626";

  return (
    <div
      className="card-lift rounded-2xl overflow-hidden bg-white animate-fade-up"
      style={{
        border: "1px solid #e2e8f0",
        borderTop: `3px solid ${accentColor}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="p-5 cursor-pointer"
        onClick={() => !item.is_premium && setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono font-bold text-slate-900 text-[13px] tracking-wide">
                {item.is_premium ? <PremiumGate name={item.ticker} /> : item.ticker}
              </span>
              {!item.is_premium && (
                <span
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold"
                  style={{
                    background: isBull ? "#d1fae5" : "#fee2e2",
                    color: isBull ? "#059669" : "#dc2626",
                    border: `1px solid ${isBull ? "#6ee7b7" : "#fca5a5"}`,
                  }}
                >
                  {isBull ? "▲" : "▼"} {item.direction}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-500 border border-slate-200">
                {item.sector}
              </span>
            </div>
            {!item.is_premium && (
              <p className="text-xs text-slate-500">{item.company_name}</p>
            )}
          </div>
          <ScoreBadge probability={item.probability} />
        </div>

        <ConfidenceMeter probability={item.probability} />

        {!item.is_premium && (
          <p className="text-xs text-slate-500 leading-relaxed mt-3 line-clamp-2">{item.catalyst}</p>
        )}
        {item.is_premium && (
          <p className="text-xs text-amber-600 mt-3 italic">Unlock catalyst analysis and full research deck →</p>
        )}

        {!item.is_premium && (
          <div className="flex items-center gap-2 mt-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              {expanded ? "▲ collapse" : "▼ expand research"}
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
        )}
      </div>

      {expanded && !item.is_premium && (
        <div style={{ borderTop: "1px solid #f1f5f9" }}>
          <div className="flex" style={{ borderBottom: "1px solid #f1f5f9" }}>
            {(["corporate", "macro", "trends", "quant"] as AccordionTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-3 text-[11px] font-bold tracking-widest uppercase transition-all"
                style={{
                  color: tab === t ? accentColor : "#94a3b8",
                  borderBottom: tab === t ? `2px solid ${accentColor}` : "2px solid transparent",
                  background: tab === t ? `${accentColor}08` : "transparent",
                }}
              >
                {t === "corporate" ? "Corp" : t === "macro" ? "Macro" : t === "trends" ? "Trend" : "Quant"}
              </button>
            ))}
          </div>
          <div className="p-4">
            {tab === "corporate" && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Return on Equity", item.fundamental_data.roe],
                  ["Revenue Growth",   item.fundamental_data.revenue_growth, true],
                  ["P/E Ratio",        String(item.fundamental_data.pe_ratio)],
                  ["Debt / Equity",    String(item.fundamental_data.debt_equity)],
                ].map(([k, v, g]) => (
                  <DataCell key={String(k)} label={String(k)} value={String(v)} green={!!g} />
                ))}
              </div>
            )}
            {tab === "macro" && (
              <p className="text-xs text-slate-600 leading-relaxed">{item.catalyst}</p>
            )}
            {tab === "trends" && (
              <div>
                <DataRow label="10-Day Momentum" value={item.quant_data.momentum_10d} />
                <DataRow label="EMA Proximity"   value={item.quant_data.ema_proximity} />
                <DataRow
                  label="News Sentiment"
                  value={item.quant_data.news_sentiment > 0 ? `+${item.quant_data.news_sentiment} Bullish` : `${item.quant_data.news_sentiment} Bearish`}
                  green={item.quant_data.news_sentiment > 0}
                />
              </div>
            )}
            {tab === "quant" && (
              <div>
                <DataRow label="RSI (14)"       value={String(item.quant_data.rsi)} />
                <DataRow label="Delivery Surge" value={item.quant_data.delivery_surge} />
                <DataRow label="Current Price"  value={`₹${item.quant_data.current_price}`} />
                <DataRow label="Risk : Reward"  value={item.risk_reward} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LT Equity Card ───────────────────────────────────────────────────────────

function LTEquityCard({ item }: { item: LongTermEquity }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<AccordionTab>("corporate");
  const accentColor = item.is_premium ? "#f59e0b" : "#4f46e5";

  return (
    <div
      className="card-lift rounded-2xl overflow-hidden bg-white animate-fade-up"
      style={{
        border: "1px solid #e2e8f0",
        borderTop: `3px solid ${accentColor}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="p-5 cursor-pointer"
        onClick={() => !item.is_premium && setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono font-bold text-slate-900 text-[13px] tracking-wide">
                {item.is_premium ? <PremiumGate name={item.ticker} /> : item.ticker}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-500 border border-slate-200">
                {item.sector}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                style={{ background: "#ede9fe", color: "#4f46e5", border: "1px solid #c4b5fd" }}
              >
                {item.horizon}
              </span>
            </div>
            {!item.is_premium && (
              <p className="text-xs text-slate-500">{item.company_name}</p>
            )}
          </div>
          <ScoreBadge probability={item.probability} />
        </div>

        <ConfidenceMeter probability={item.probability} />

        {!item.is_premium && (
          <p className="text-xs text-slate-500 leading-relaxed mt-3 line-clamp-2">{item.structural_drivers}</p>
        )}
        {item.is_premium && (
          <p className="text-xs text-amber-600 mt-3 italic">Unlock structural driver analysis →</p>
        )}

        {!item.is_premium && (
          <div className="flex items-center gap-2 mt-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              {expanded ? "▲ collapse" : "▼ expand research"}
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
        )}
      </div>

      {expanded && !item.is_premium && (
        <div style={{ borderTop: "1px solid #f1f5f9" }}>
          <div className="flex" style={{ borderBottom: "1px solid #f1f5f9" }}>
            {(["corporate", "macro", "trends", "quant"] as AccordionTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-3 text-[11px] font-bold tracking-widest uppercase transition-all"
                style={{
                  color: tab === t ? accentColor : "#94a3b8",
                  borderBottom: tab === t ? `2px solid ${accentColor}` : "2px solid transparent",
                  background: tab === t ? `${accentColor}08` : "transparent",
                }}
              >
                {t === "corporate" ? "Corp" : t === "macro" ? "Macro" : t === "trends" ? "Trend" : "Quant"}
              </button>
            ))}
          </div>
          <div className="p-4">
            {tab === "corporate" && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Return on Equity", item.fundamental_data.roe],
                  ["Revenue Growth",   item.fundamental_data.revenue_growth, true],
                  ["P/E Ratio",        String(item.fundamental_data.pe_ratio)],
                  ["Debt / Equity",    String(item.fundamental_data.debt_equity)],
                ].map(([k, v, g]) => (
                  <DataCell key={String(k)} label={String(k)} value={String(v)} green={!!g} />
                ))}
              </div>
            )}
            {tab === "macro" && (
              <p className="text-xs text-slate-600 leading-relaxed">{item.structural_drivers}</p>
            )}
            {tab === "trends" && (
              <p className="text-xs text-slate-600 leading-relaxed">
                Structural long-term compounder. Investment horizon:{" "}
                <span className="font-bold text-indigo-600">{item.horizon}</span>.
                Sector-specific tailwinds remain intact based on latest macro scan.
              </p>
            )}
            {tab === "quant" && (
              <div>
                <DataRow label="Confidence Score"   value={`${item.probability}%`} green />
                <DataRow label="Investment Horizon" value={item.horizon} />
                <DataRow label="Sector"             value={item.sector} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Metal Card ───────────────────────────────────────────────────────────────

function MetalCard({ item }: { item: PreciousMetal }) {
  const [expanded, setExpanded] = useState(false);
  const isBull = item.bias.includes("BULL");
  const accentColor = item.is_premium ? "#f59e0b" : isBull ? "#d97706" : "#64748b";

  return (
    <div
      className="card-lift rounded-2xl overflow-hidden bg-white animate-fade-up"
      style={{
        border: "1px solid #e2e8f0",
        borderTop: `3px solid ${accentColor}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="p-5 cursor-pointer"
        onClick={() => !item.is_premium && setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-bold text-slate-900 text-sm">
                {item.is_premium ? <PremiumGate name={item.asset_name} /> : item.asset_name}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                style={{
                  background: isBull ? "#fef3c7" : "#f1f5f9",
                  color: isBull ? "#92400e" : "#64748b",
                  border: `1px solid ${isBull ? "#fcd34d" : "#e2e8f0"}`,
                }}
              >
                {item.bias}
              </span>
            </div>
            <p className="font-mono text-xs text-slate-400">SPOT ${item.spot_price_usd.toLocaleString()} USD</p>
          </div>
          <ScoreBadge probability={item.probability} />
        </div>

        <ConfidenceMeter probability={item.probability} />

        {!item.is_premium && (
          <p className="text-xs text-slate-500 leading-relaxed mt-3 line-clamp-2">{item.macro_drivers}</p>
        )}

        {!item.is_premium && (
          <div className="flex items-center gap-2 mt-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              {expanded ? "▲ collapse" : "▼ expand drivers"}
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
        )}
      </div>

      {expanded && !item.is_premium && (
        <div className="px-5 pb-5 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
          <p className="text-xs text-slate-600 leading-relaxed">{item.macro_drivers}</p>
        </div>
      )}
    </div>
  );
}

// ─── MF Card ─────────────────────────────────────────────────────────────────

function MFCard({ item }: { item: MutualFund }) {
  const [expanded, setExpanded] = useState(false);
  const accentColor = item.is_premium ? "#f59e0b" : "#7c3aed";

  return (
    <div
      className="card-lift rounded-2xl overflow-hidden bg-white animate-fade-up"
      style={{
        border: "1px solid #e2e8f0",
        borderTop: `3px solid ${accentColor}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="p-5 cursor-pointer"
        onClick={() => !item.is_premium && setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                style={{ background: "#ede9fe", color: "#6d28d9", border: "1px solid #ddd6fe" }}
              >
                {item.category}
              </span>
              <span className="text-xs text-slate-400">{item.amc}</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-snug">
              {item.is_premium ? <PremiumGate name={item.fund_name} /> : item.fund_name}
            </p>
          </div>
          <ScoreBadge probability={item.probability} />
        </div>

        <ConfidenceMeter probability={item.probability} />

        {!item.is_premium && (
          <div className="flex items-center gap-6 mt-4 pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-0.5">Sharpe Ratio</p>
              <p className="font-mono text-sm font-bold text-slate-900">{item.sharpe_ratio}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-0.5">3Y CAGR</p>
              <p className="font-mono text-sm font-bold text-emerald-600">{item.cagr_3yr}</p>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="h-px w-16 bg-slate-100" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                {expanded ? "▲" : "▼"} details
              </span>
            </div>
          </div>
        )}
      </div>

      {expanded && !item.is_premium && (
        <div className="px-5 pb-5 pt-4 space-y-2" style={{ borderTop: "1px solid #f1f5f9" }}>
          <p className="text-xs text-slate-600 leading-relaxed">{item.alpha_rating}</p>
          <p className="text-xs text-slate-500 leading-relaxed">{item.action_outlook}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = "short" | "long" | "metals" | "mf";

const TABS: { id: Tab; label: string; short: string; color: string; count?: number }[] = [
  { id: "short",  label: "Short-Term Trading",    short: "SHORT-TERM", color: "#059669" },
  { id: "long",   label: "Long-Term Compounders", short: "LONG-TERM",  color: "#4f46e5" },
  { id: "metals", label: "Precious Metals",       short: "METALS",     color: "#d97706" },
  { id: "mf",     label: "Mutual Fund Quant",     short: "MF QUANT",   color: "#7c3aed" },
];

export default function FinSightDashboard() {
  const [data, setData]       = useState<Payload | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [tab, setTab]         = useState<Tab>("short");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/high_conviction_v2.json")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #f0f9ff 0%, #f8fafc 40%, #faf5ff 100%)",
        color: "#0f172a",
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(226,232,240,0.8)",
          boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                boxShadow: "0 4px 12px rgba(14,165,233,0.35)",
              }}
            >
              <span className="font-mono font-black text-white text-xs tracking-wider">FS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight">FinSight</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest"
                  style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)", color: "#fff" }}
                >
                  INDIA
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">
                Quantitative Intelligence
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#10b981", boxShadow: "0 0 6px #10b981" }}
              />
              <span className="text-[11px] font-bold text-emerald-600 tracking-widest uppercase">LIVE</span>
            </div>

            {data?.governor_active && (
              <span
                className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide"
                style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  border: "1px solid #fcd34d",
                  boxShadow: "0 2px 8px rgba(251,191,36,0.2)",
                }}
              >
                ⚠ VIX GOVERNOR ACTIVE
              </span>
            )}

            {data && (
              <span className="font-mono text-[11px] text-slate-400 hidden lg:block">
                {formatTs(data.generation_timestamp)}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── LOADING ─────────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-12 h-12 rounded-full animate-spin"
                style={{
                  border: "2px solid #e2e8f0",
                  borderTop: "2px solid #0ea5e9",
                  boxShadow: "0 0 20px rgba(14,165,233,0.2)",
                }}
              />
              <div className="text-center">
                <p className="text-sm font-bold text-sky-600 tracking-widest uppercase">Initializing</p>
                <p className="text-xs text-slate-400 mt-1">Loading analytics payload…</p>
              </div>
            </div>
          </div>
        )}

        {/* ── ERROR ───────────────────────────────────────────────────────── */}
        {error && (
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: "#fff1f2", border: "1px solid #fecdd3" }}
          >
            <p className="text-sm font-bold text-rose-600 mb-1">Payload Load Error</p>
            <p className="text-xs text-slate-500">{error}</p>
            <p className="text-xs text-slate-400 mt-1">
              Ensure{" "}
              <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                public/high_conviction_v2.json
              </code>{" "}
              exists and is valid.
            </p>
          </div>
        )}

        {data && (
          <>
            {/* ── MACRO PULSE ─────────────────────────────────────────────── */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-black tracking-widest uppercase text-slate-400">
                  Macro Pulse
                </span>
                <div className="h-px flex-1 bg-slate-200" />
                <span className="font-mono text-xs text-slate-300">
                  VIX {data.vix_at_generation}
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "DXY Trend",     value: data.macro_pulse.dxy_trend,             icon: "💵", grad: "linear-gradient(135deg,#e0f2fe,#f0f9ff)", accent: "#0284c7" },
                  { label: "India VIX",     value: data.macro_pulse.market_volatility_vix,  icon: "📊", grad: "linear-gradient(135deg,#fce7f3,#fdf2f8)", accent: data.vix_at_generation > 18 ? "#dc2626" : "#db2777" },
                  { label: "US Real Yield", value: data.macro_pulse.us_real_yield,          icon: "🏦", grad: "linear-gradient(135deg,#f0fdf4,#dcfce7)",  accent: "#16a34a" },
                  { label: "Sentiment",     value: data.macro_pulse.global_sentiment,       icon: "🌐", grad: "linear-gradient(135deg,#faf5ff,#ede9fe)",  accent: "#7c3aed" },
                ].map(({ label, value, icon, grad, accent }) => (
                  <div
                    key={label}
                    className="rounded-2xl p-4"
                    style={{
                      background: grad,
                      border: "1px solid rgba(255,255,255,0.7)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-lg">{icon}</span>
                      <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: accent + "99" }}>
                        {label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold leading-snug" style={{ color: accent }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── STAT BAR ────────────────────────────────────────────────── */}
            <div
              className="flex flex-wrap items-center gap-x-8 gap-y-2 px-5 py-3 rounded-2xl"
              style={{ background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              {[
                { label: "India VIX",  value: String(data.vix_at_generation), color: data.vix_at_generation > 18 ? "#dc2626" : "#059669" },
                { label: "Governor",   value: data.governor_active ? "ACTIVE" : "INACTIVE", color: data.governor_active ? "#d97706" : "#94a3b8" },
                { label: "Pipeline",   value: `v${data.pipeline_version}`, color: "#94a3b8" },
                { label: "Total Picks",value: String(data.short_term_equities.length + data.long_term_equities.length + data.precious_metals.length + data.mutual_funds.length), color: "#0ea5e9" },
                { label: "Last Run",   value: formatTs(data.generation_timestamp), color: "#64748b" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-300">{label}</span>
                  <span className="font-mono text-xs font-bold" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>

            {/* ── TABS ────────────────────────────────────────────────────── */}
            <div
              className="flex gap-1.5 p-1.5 rounded-2xl overflow-x-auto"
              style={{ background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              {TABS.map((t) => {
                const count =
                  t.id === "short"  ? data.short_term_equities.length :
                  t.id === "long"   ? data.long_term_equities.length :
                  t.id === "metals" ? data.precious_metals.length :
                  data.mutual_funds.length;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200"
                    style={{
                      background: active ? t.color : "transparent",
                      color: active ? "#fff" : "#94a3b8",
                      boxShadow: active ? `0 4px 14px ${t.color}40` : "none",
                    }}
                  >
                    <span className="text-[11px] font-black tracking-widest uppercase">{t.short}</span>
                    <span
                      className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: active ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                        color: active ? "#fff" : "#94a3b8",
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── SECTION HEADER ──────────────────────────────────────────── */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="w-1.5 h-6 rounded-full"
                    style={{ background: activeTab.color }}
                  />
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    {tab === "short"  && "Short-Term Trading Signals"}
                    {tab === "long"   && "Long-Term Structural Compounders"}
                    {tab === "metals" && "Precious Metals Market Cycles"}
                    {tab === "mf"     && "Mutual Fund Quant Track"}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 ml-5">
                  {tab === "short"  && "1–10 day high-conviction setups · Price-action velocity · Institutional footprint"}
                  {tab === "long"   && "1–3 year horizon · RoE expansion · Capex cycle beneficiaries"}
                  {tab === "metals" && "DXY · Real yields · Central bank reserves · Geopolitical tension"}
                  {tab === "mf"     && "Alpha generation · Sharpe ratio · Rolling AUM inflow momentum"}
                </p>
              </div>
              <span
                className="font-mono text-[10px] font-bold tracking-widest uppercase hidden sm:block mt-1 px-2.5 py-1 rounded-full"
                style={{ background: activeTab.color + "15", color: activeTab.color }}
              >
                {tab === "short" ? "1–10 DAYS" : tab === "long" ? "1–3 YEARS" : tab === "metals" ? "GLOBAL MACRO" : "SYSTEMATIC"}
              </span>
            </div>

            {/* ── ASSET GRID ──────────────────────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-4">
              {tab === "short"  && data.short_term_equities.map((item) => <STEquityCard key={item.ticker}     item={item} />)}
              {tab === "long"   && data.long_term_equities.map((item)  => <LTEquityCard key={item.ticker}     item={item} />)}
              {tab === "metals" && data.precious_metals.map((item)     => <MetalCard    key={item.asset_name} item={item} />)}
              {tab === "mf"     && data.mutual_funds.map((item)        => <MFCard       key={item.fund_name}  item={item} />)}
            </div>
          </>
        )}
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="rounded-2xl p-5 mb-6" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
            <div className="flex gap-3">
              <span className="text-amber-500 text-sm shrink-0 mt-0.5">⚖</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-bold">Regulatory Disclosure: </span>
                FinSight India is an automated quantitative research utility. This system processes open macro indicators, corporate filing disclosures, and historical market patterns using rule-based scoring models.
                It does <span className="font-bold">not</span> provide SEBI-registered financial advisory services, personalized investment mandates, or direct execution buy/sell trade alerts.
                All probability scores are model outputs, not guarantees of future returns. Investments in securities markets are subject to market risks.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#0ea5e9,#0284c7)" }}
              >
                <span className="font-mono font-black text-white text-[9px]">FS</span>
              </div>
              <span className="font-mono text-xs text-slate-400">
                FinSight India · Pipeline v{data?.pipeline_version ?? "—"}
              </span>
            </div>
            <span className="font-mono text-xs text-slate-300 uppercase tracking-widest">
              Not SEBI Registered · Research Utility Only
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
